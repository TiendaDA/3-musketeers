<p align="center">
  <a href="https://tiendada.com" target="_blank">
    <picture>
      <img width="422" alt="3-musketeers" src="resources/logo-small-java.png">
    </picture>
  </a>
</p>

<p align="center">
  <a href="https://www.gnu.org/licenses/gpl-3.0">
    <img src="https://img.shields.io/badge/License-GPLv3-blue.svg" alt="GNU GPL V3">
  </a>
</p>

<p align="center">
  Welcome to the 🤺 <b>3-musketeers</b> <b>Java</b> repo. <br/>
  Minimal library for handling multiple analytics providers.
</p>

## ⚡️ Quickstart

#### Initialization
```java
var t3m = new T3M()
.registerProvider(new GoogleAnalytics4("ga4ApiSecret", "ga4MeasurementId"))
.registerProvider(new CustomerIODataPipeline("customerioDataPipelineApiKey"))
.registerProvider(new Amplitude("amplitudeApiKey"));
```

#### Use
```java
var trackRequest = TrackRequest.builder().build();
t3m.track(List.of(trackRequest));
```

## 👀 Examples

#### Google Analytics 4, CustomerIODataPipeline -> Event: "SIGN_UP"
```java
    var identifier =
        Identifier.builder()
        .providers(
        Map.of(
            GoogleAnalytics4.name,
            Map.of("client_id", "GA1.1...", "user_id", "USER_1"),
            CustomerIODataPipeline.name,
            Map.of("user_id", "USER_1")))
        .build();

    utmParams = UTMParams.builder()
        .utmCampaign("campaign")
        .utmContent("content")
        .utmMedium("medium")
        .utmSource("source")
        .utmTerm("term")
        .build();

    var trackRequest = TrackRequest.builder()
        .identifier(identifier)
        .eventName("SIGN_UP")
        .eventAttributes(Map.of("first_name", "first_name", "email", "email"))
        .utmParams(utmParams)
        .timestamp(OffsetDateTime.now())
        .build();

    t3m.track(List.of(trackRequest));
```

## 🎯 Included Providers

- **Google Analytics 4** [[definition]](https://github.com/TiendaDA/3-musketeers/blob/develop/packages/3-musketeers-java/src/main/java/com.tiendada.musketeers/provider/googleanalytics4/GoogleAnalytics4.java)
- **Amplitude** [[definition]](https://github.com/TiendaDA/3-musketeers/blob/develop/packages/3-musketeers-java/src/main/java/com.tiendada.musketeers/provider/amplitude/Amplitude.java)
- **CustomerIOJourney** [[definition]](https://github.com/TiendaDA/3-musketeers/blob/develop/packages/3-musketeers-java/src/main/java/com.tiendada.musketeers/provider/customerio/CustomerIOJourney.java)
- **CustomerIODataPipeline** [[definition]](https://github.com/TiendaDA/3-musketeers/blob/develop/packages/3-musketeers-java/src/main/java/com.tiendada.musketeers/provider/customerio/CustomerIODataPipeline.java)
