export const colors = {
  //text
  primaryText: '#2F2F2F',
  secondaryText: '#fff',
  tertiaryText: '#8D8D8D',
  //buttons
  primaryButton: '#2F2F2F',
  //original bgs
  primaryBg: '#fff',
  //shades
  white: '#fff',
  offwhite: '#E4E4E4',
  lightGrey: '#C9C9C9',
  darkGrey: '#8D8D8D',
  black: '#000',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const typography = {
  title: {
    fontSize: 24,
    fontWeight: 'bold' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
  },
};

export const mixins = {
  centerContent: {
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  primaryButton: {
    backgroundColor: colors.primaryButton,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // for Android
  },
};
