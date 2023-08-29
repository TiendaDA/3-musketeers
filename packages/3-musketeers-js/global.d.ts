interface Window {
  dataQueue: unknown[];
  dataLayer: unknown[];
  gtag: (...args: unknown[]) => void;
  t3musketeers: unknown;
  _fbq: unknown;
  fbq: {
    callMethod: (...args: unknown[]) => void;
    push: (...args: unknown[]) => void;
    loaded: boolean;
    version: string;
    queue: unknown[];
  };
  _cio: {
    push: (...args: unknown[]) => void;
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
}
