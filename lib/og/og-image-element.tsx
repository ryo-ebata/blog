import type { OgImageParams } from './og-params';
import { OG_IMAGE_SIZE } from './og-params';

export const OgImageElement = ({ title, subtitle }: OgImageParams) => (
  <div
    style={{
      alignItems: 'center',
      background: '#faf8f4',
      display: 'flex',
      flexDirection: 'column',
      height: OG_IMAGE_SIZE.height,
      justifyContent: 'center',
      padding: '60px 80px',
      width: OG_IMAGE_SIZE.width,
    }}
  >
    <div
      style={{
        color: '#b5613f',
        fontFamily: 'Noto Sans JP',
        fontSize: 32,
        fontWeight: 700,
        marginBottom: 24,
      }}
    >
      ebaryo.dev
    </div>
    <div
      style={{
        color: '#3a3733',
        display: 'flex',
        fontFamily: 'Noto Sans JP',
        fontSize: 48,
        fontWeight: 700,
        lineHeight: 1.4,
        textAlign: 'center',
      }}
    >
      {title}
    </div>
    {subtitle ? (
      <div
        style={{
          color: '#8a8276',
          fontFamily: 'Noto Sans JP',
          fontSize: 24,
          marginTop: 16,
        }}
      >
        {subtitle}
      </div>
    ) : null}
  </div>
);
