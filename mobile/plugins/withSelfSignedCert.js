/**
 * Expo config plugin that adds native SSL bypass for self-signed certificates
 * on local-network WebSocket connections (iOS + Android).
 *
 * iOS:  Writes an Objective-C file that swizzles SocketRocket to skip TLS
 *       chain validation for private IP / .local hosts, then adds it to
 *       the Xcode project compile sources.
 *
 * Android: Writes a CustomClientBuilder that configures OkHttp to trust all
 *          certs, and registers it in MainApplication.kt.
 */
const {
  withXcodeProject,
  withDangerousMod,
} = require('expo/config-plugins');
const path = require('path');
const fs = require('fs');

// ---------------------------------------------------------------------------
// iOS native source
// ---------------------------------------------------------------------------
const IOS_FILE_NAME = 'SelfSignedCertHandler.m';
const IOS_SOURCE = `\
// Allows WebSocket connections to local-network devices with self-signed TLS
// certificates (e.g. ESP32 IoT hardware). Only applied when the host is a
// private/link-local IP or a .local mDNS name; public hosts are unaffected.

#import <Foundation/Foundation.h>
#import <objc/runtime.h>

#pragma mark - Helpers

static BOOL isLocalNetworkHost(NSString *host) {
    if (!host) return NO;
    if ([host hasPrefix:@"10."]) return YES;
    if ([host hasPrefix:@"192.168."]) return YES;
    if ([host hasPrefix:@"172."]) {
        NSArray *parts = [host componentsSeparatedByString:@"."];
        if (parts.count >= 2) {
            int octet = [parts[1] intValue];
            if (octet >= 16 && octet <= 31) return YES;
        }
    }
    if ([host isEqualToString:@"localhost"] || [host isEqualToString:@"127.0.0.1"]) return YES;
    if ([host hasSuffix:@".local"]) return YES;
    return NO;
}

#pragma mark - Swizzle

@implementation NSObject (LocalNetworkSSLBypass)

+ (void)load {
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        Class srClass = NSClassFromString(@"SRWebSocket");
        if (!srClass) return;

        SEL origSel   = @selector(initWithURLRequest:protocols:);
        SEL spInitSel  = @selector(initWithURLRequest:protocols:securityPolicy:);
        SEL polInitSel = @selector(initWithCertificateChainValidationEnabled:);

        Method origMethod = class_getInstanceMethod(srClass, origSel);
        Method spMethod   = class_getInstanceMethod(srClass, spInitSel);
        if (!origMethod || !spMethod) return;

        Class polClass = NSClassFromString(@"SRSecurityPolicy");
        if (!polClass) return;
        Method polInitMethod = class_getInstanceMethod(polClass, polInitSel);
        if (!polInitMethod) return;

        IMP origIMP    = method_getImplementation(origMethod);
        IMP spIMP      = method_getImplementation(spMethod);
        IMP polInitIMP = method_getImplementation(polInitMethod);

        IMP replacement = imp_implementationWithBlock(^id(id self, NSURLRequest *request, NSArray *protocols) {
            if (isLocalNetworkHost(request.URL.host)) {
                typedef id (*PolInitFn)(id, SEL, BOOL);
                id policy = ((PolInitFn)polInitIMP)([polClass alloc], polInitSel, NO);
                if (policy) {
                    typedef id (*SPInitFn)(id, SEL, NSURLRequest *, NSArray *, id);
                    return ((SPInitFn)spIMP)(self, spInitSel, request, protocols, policy);
                }
            }
            typedef id (*OrigFn)(id, SEL, NSURLRequest *, NSArray *);
            return ((OrigFn)origIMP)(self, origSel, request, protocols);
        });

        method_setImplementation(origMethod, replacement);
    });
}

@end
`;

// ---------------------------------------------------------------------------
// Android native source
// ---------------------------------------------------------------------------
const ANDROID_FILE_NAME = 'SelfSignedCertClientBuilder.kt';
const ANDROID_SOURCE = `\
package com.myapp.app

import com.facebook.react.modules.network.CustomClientBuilder
import java.security.SecureRandom
import java.security.cert.X509Certificate
import javax.net.ssl.SSLContext
import javax.net.ssl.TrustManager
import javax.net.ssl.X509TrustManager
import okhttp3.OkHttpClient

/**
 * Configures OkHttp to accept self-signed TLS certificates so the app can
 * talk to local ESP32 IoT devices over WSS. Applied only to the React Native
 * WebSocket module's OkHttpClient (does not affect Axios / fetch).
 */
class SelfSignedCertClientBuilder : CustomClientBuilder {
    override fun apply(builder: OkHttpClient.Builder) {
        val trustAll = arrayOf<TrustManager>(object : X509TrustManager {
            override fun checkClientTrusted(chain: Array<X509Certificate>, authType: String) = Unit
            override fun checkServerTrusted(chain: Array<X509Certificate>, authType: String) = Unit
            override fun getAcceptedIssuers(): Array<X509Certificate> = emptyArray()
        })

        val ctx = SSLContext.getInstance("TLS")
        ctx.init(null, trustAll, SecureRandom())

        builder
            .sslSocketFactory(ctx.socketFactory, trustAll[0] as X509TrustManager)
            .hostnameVerifier { _, _ -> true }
    }
}
`;

const MAIN_APP_IMPORT = 'import com.facebook.react.modules.websocket.WebSocketModule';
const MAIN_APP_REGISTER = '    WebSocketModule.setCustomClientBuilder(SelfSignedCertClientBuilder())';

// ---------------------------------------------------------------------------
// Plugin implementation
// ---------------------------------------------------------------------------

function withSelfSignedCertIOS(config) {
  // 1. Write the .m file
  config = withDangerousMod(config, [
    'ios',
    (cfg) => {
      const iosDir = path.join(cfg.modRequest.platformProjectRoot, cfg.modRequest.projectName);
      fs.writeFileSync(path.join(iosDir, IOS_FILE_NAME), IOS_SOURCE, 'utf-8');
      return cfg;
    },
  ]);

  // 2. Add it to the Xcode project compile sources
  config = withXcodeProject(config, (cfg) => {
    const project = cfg.modResults;
    const projectName = cfg.modRequest.projectName;
    const filePath = `${projectName}/${IOS_FILE_NAME}`;

    // Check if already present by scanning PBXFileReference entries
    const fileRefs = project.hash.project.objects.PBXFileReference || {};
    const alreadyAdded = Object.values(fileRefs).some(
      (ref) => typeof ref === 'object' && ref.path === IOS_FILE_NAME,
    );

    if (!alreadyAdded) {
      project.addSourceFile(filePath, null, project.findPBXGroupKey({ name: projectName }) || project.getFirstProject().firstProject.mainGroup);
    }

    return cfg;
  });

  return config;
}

function withSelfSignedCertAndroid(config) {
  return withDangerousMod(config, [
    'android',
    (cfg) => {
      const androidRoot = cfg.modRequest.platformProjectRoot;
      const javaDir = path.join(androidRoot, 'app', 'src', 'main', 'java', 'com', 'myapp', 'app');

      // Write the builder file
      const builderPath = path.join(javaDir, ANDROID_FILE_NAME);
      if (!fs.existsSync(builderPath)) {
        fs.writeFileSync(builderPath, ANDROID_SOURCE, 'utf-8');
      }

      // Patch MainApplication.kt to register the builder
      const mainAppPath = path.join(javaDir, 'MainApplication.kt');
      if (fs.existsSync(mainAppPath)) {
        let content = fs.readFileSync(mainAppPath, 'utf-8');

        if (!content.includes(MAIN_APP_IMPORT)) {
          content = content.replace(
            'import expo.modules.ApplicationLifecycleDispatcher',
            `${MAIN_APP_IMPORT}\nimport expo.modules.ApplicationLifecycleDispatcher`,
          );
        }

        if (!content.includes('setCustomClientBuilder')) {
          content = content.replace(
            'super.onCreate()',
            `super.onCreate()\n${MAIN_APP_REGISTER}`,
          );
        }

        fs.writeFileSync(mainAppPath, content, 'utf-8');
      }

      return cfg;
    },
  ]);
}

function withSelfSignedCert(config) {
  config = withSelfSignedCertIOS(config);
  config = withSelfSignedCertAndroid(config);
  return config;
}

module.exports = withSelfSignedCert;
