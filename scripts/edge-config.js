/**
 * Edge runtime configuration
 * Used to configure the Next.js build process for Edge functions
 */

module.exports = {
  // List of packages that should not be included in Edge functions
  excludePackages: [
    'react',
    'react-dom',
    '@babel/plugin-transform-react-jsx',
    '@babel/plugin-transform-private-methods',
    '@babel/plugin-transform-private-property-in-object',
    '@babel/plugin-transform-class-properties'
  ],
  
  // Helper function to determine if a module should be excluded from Edge functions
  shouldExclude: function(modulePath) {
    return this.excludePackages.some(pkg => 
      modulePath.includes(`/node_modules/${pkg}/`) || 
      modulePath === pkg
    );
  }
}; 