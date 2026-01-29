// Design tokens for consistent styling
export const colors = {
  background: {
    primary: '#FAFAFA',
    gradient: 'linear-gradient(135deg, #FFFFFF 0%, #F7F7FF 50%, #EEF6FF 100%)',
  },
  text: {
    primary: '#1A1A1A',
    secondary: '#6B7280',
    muted: '#9CA3AF',
  },
  accent: {
    primary: '#6366F1',
    secondary: '#8B5CF6',
  },
};

export const typography = {
  h1: {
    size: 'clamp(44px, 5vw, 76px)',
    weight: '300',
    lineHeight: '1.05',
    letterSpacing: '-0.02em',
  },
  body: {
    size: '18px',
    lineHeight: '1.6',
  },
};

export const spacing = {
  section: '120px',
  card: '24px',
};
