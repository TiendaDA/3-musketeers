interface Window {
  dataQueue: unknown[];
  dataLayer: unknown[];
  gtag: (...args: unknown[]) => void;
  t3musketeers: unknown;
  amplitude: {
    init: (...args: unknown[]) => void;
    track: (...args: unknown[]) => void;
    Identify: (...args: unknown[]) => void;
    setUserId: (...args: unknown[]) => void;
    identify: (...args: unknown[]) => void;
  };

  _fbq: unknown;
  fbq: {
    callMethod: (...args: unknown[]) => void;
    push: (...args: unknown[]) => void;
    loaded: boolean;
    version: string;
    queue: unknown[];
  };
  analytics: {
    // push: (...args: unknown[]) => void;
    load: (...args: unknown[]) => void;
    page: (...args: unknown[]) => void;
    track: (...args: unknown[]) => void;
    identify: (...args: unknown[]) => void;
  };
  userGuidingLayer: unknown[];
  userGuiding: {
    previewGuide: (...args: unknown[]) => void;
    finishPreview: (...args: unknown[]) => void;
    track: (...args: unknown[]) => void;
    identify: (...args: unknown[]) => void;
    hideChecklist: (...args: unknown[]) => void;
    launchChecklist: (...args: unknown[]) => void;
    q: unknown[];
    c: (...args: unknown[]) => void;
  };
  ttq: {
    track: (...args: unknown[]) => void;
    identify: (...args: unknown[]) => void;
    page: (...args: unknown[]) => void;
  };
}
