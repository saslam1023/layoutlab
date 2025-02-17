function scanAndGenerateStyles() {
  const elementsWithStyles = document.querySelectorAll('*[style]');
  const styleDefinitions = [];

  elementsWithStyles.forEach(el => {
      const inlineStyles = el.getAttribute('style').split(';')
          .map(style => style.trim())
          .filter(Boolean) // Remove empty styles
          .filter(style => !shouldIgnoreStyle(style)); // Filter out ignored styles

      const cssProperties = inlineStyles.map(style => {
          const [property, value] = style.split(':').map(part => part.trim());
          return `  ${convertToCssProperty(property)}: ${value};`;
      });

      if (cssProperties.length > 0) {
          // Find the closest parent with an ID
          const closestParentWithId = el.closest('[id]');
          let selector;

          if (el.id) {
              // If the current element has an ID, use it directly
              selector = `.${el.id}`;
          } else if (closestParentWithId) {
              // If the parent has an ID, create a nested selector
              const parentId = closestParentWithId.id;
              const tagName = el.tagName.toLowerCase();
              selector = `.${parentId} ${tagName}`;
          } else {
              // Skip the element if no ID is available for the selector
              return;
          }

          // Combine selector and properties into a CSS rule
          const cssRule = `${selector} {\n${cssProperties.join('\n')}\n}`;
          styleDefinitions.push(cssRule);
      }
  });

  // Display the prettified CSS output
  const outputContainer = document.getElementById('generated-styles');
  outputContainer.textContent = styleDefinitions.length ?
      styleDefinitions.join('\n\n') :
      'No inline styles found!';
}

function convertToCssProperty(property) {
  // Converts JavaScript-style properties to CSS-style properties
  return property.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
}

function shouldIgnoreStyle(style) {
  // List of styles to ignore (case-insensitive match)
  const ignoreList = ['display: none', 'display: block', 'visibility: hidden', 'background-color:transparent', 'border: none', 'opacity: 0'];

  return ignoreList.some(ignored => style.toLowerCase().startsWith(ignored));
}