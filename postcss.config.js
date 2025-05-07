module.exports = {
  plugins: {
    // Use tailwindcss for utility-first CSS
    tailwindcss: {},
    
    // Use autoprefixer to add vendor prefixes for cross-browser compatibility
    autoprefixer: {
      // Configure autoprefixer options if needed
      // flexbox: 'no-2009',
      // grid: 'autoplace',
    },
    
    // Enable cssnano for production optimization (minification)
    ...(process.env.NODE_ENV === 'production'
      ? {
          cssnano: {
            preset: ['default', { 
              discardComments: { removeAll: true },
              // Additional cssnano optimizations if needed
              // colormin: false, // Disable color minification
              // mergeLonghand: false, // Disable merging of longhand properties
            }],
          },
        }
      : {}),
    
    // Add other PostCSS plugins based on needs
    // 'postcss-import': {}, // For @import support
    // 'postcss-nested': {}, // For nesting support
    // 'postcss-custom-properties': {}, // For CSS variables
  },
};

