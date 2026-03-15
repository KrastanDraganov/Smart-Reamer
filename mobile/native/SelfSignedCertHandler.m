// mobile/ios/MyApp/SelfSignedCertHandler.m

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
