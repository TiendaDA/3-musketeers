<p align="center">
  <a href="https://tiendada.com" target="_blank">
    <picture>
      <img width="422" alt="3-musketeers" src="resources/logo-small-js.png">
    </picture>
  </a>
</p>

<p align="center">
  <a href="https://www.gnu.org/licenses/gpl-3.0">
    <img src="https://img.shields.io/badge/License-GPLv3-blue.svg" alt="GNU GPL V3">
  </a>
</p>

<p align="center">
  Welcome to the 🤺 <b>3-musketeers</b> <b>JavaScript</b> repo. <br/>
  Minimal library for handling multiple browser analytics providers.
</p>

## ⚡️ Quickstart

#### Load

```html
<!-- 3-musketeers (3m.js) -->
<script async src="https://<path_to_js>"></script>
<script>
  window.dataQueue = window.dataQueue || [];
  function t3m() {
    dataQueue.push(arguments);
  }
</script>
```

#### Use

```javascript
t3m('init', 'google-analytics', 'G-1234567');
t3m('page', 'On-Boarding');
t3m('track', 'On-Boarding Started', {
  category: 'On-Boarding',
  action: 'Started',
});
```

## 👀 Examples

#### Google Analytics 4 + custom track event name transformation ("On-Boarding Started" ➜ "on_boarding_started")

```html
<!-- 3-musketeers (3m.js) -->
<script async src="https://<path_to_js>"></script>
<script>
  window.dataQueue = window.dataQueue || [];
  function t3m() {
    dataQueue.push(arguments);
  }

  t3m('init', 'google-tag-manager', 'G-1234567', {
    mapTrackEvent: (name, params) => {
      const eventName = name.replaceAll(' ', '_').replace('-', '_').toLowerCase(),
      return {
        eventName,
        params,
      }
    }
  });

  t3m('identify', 'user-id-123', {
    firstName: 'Hal',
    lastName: '9000',
    email: 'space@odyssey.com',
  });

  t3m('page', 'On-Boarding');

  t3m('track', 'On-Boarding Started', {
    category: 'On-Boarding',
    action: 'Started',
  });
</script>
```

## 📖 Command documentation

| Command  | Arguments                                                                  | Description                                                                                     |
| -------- | -------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| init     | `(...args: any[])`                                                         | Initialize provider. It has dynamic arguments and it's defined in each provider implementation. |
| page     | `(name: string, params?: Record<string, string>)`                          | Record each time user sees a website page.                                                      |
| track    | `(eventName: string, params?: Record<string, any>, callback?: () => void)` | Record an action performed by a user.                                                           |
| identify | `(userId: string, params?: Record<string, any>)`                           | Attach current session and actions made to some identifiable user.                              |

## 🎯 Included Providers

- **Amplitude** [[definition]](https://github.com/TiendaDA/3-musketeers/blob/main/packages/3-musketeers-js/src/3-musketeers/provider/amplitude/index.ts)
- **Google Tag Manager** [[definition]](https://github.com/TiendaDA/3-musketeers/blob/main/packages/3-musketeers-js/src/3-musketeers/provider/google-analytics/index.ts)
- **Facebook Pixel** [[definition]](https://github.com/TiendaDA/3-musketeers/blob/main/packages/3-musketeers-js/src/3-musketeers/provider/facebook-pixel/index.ts)
- **Customer io** [[definition]](https://github.com/TiendaDA/3-musketeers/blob/main/packages/3-musketeers-js/src/3-musketeers/provider/customer-io/index.ts)
- **Hotjar** [[definition]](https://github.com/TiendaDA/3-musketeers/blob/main/packages/3-musketeers-js/src/3-musketeers/provider/hotjar/index.ts)
- **User guiding** [[definition]](https://github.com/TiendaDA/3-musketeers/blob/main/packages/3-musketeers-js/src/3-musketeers/provider/user-guiding/index.ts)

## Resources

- https://stacktonic.com/article/the-independent-event-driven-data-layer-a-practical-guide
