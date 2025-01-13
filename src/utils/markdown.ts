/**
 * Utility functions for handling markdown content throughout the application.
 * 
 * @module utils/markdown
 */

/**
 * Fetches and returns markdown content from a specified file
 * 
 * @async
 * @param {string} filename - The name of the markdown file to fetch
 * @returns {Promise<string>} The markdown content as a string
 * @throws {Error} When the fetch operation fails
 */
export async function fetchMarkdownContent(filename: string): Promise<string> {
  try {
    const response = await fetch(`/${filename}`);
    const markdown = await response.text();
    return markdown;
  } catch (error) {
    console.error('Error fetching markdown:', error);
    return 'Error loading content';
  }
}
