// mobile/android/app/src/main/java/com/myapp/app/SelfSignedCertClientBuilder.kt

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
