/**
 * Orientation Section Handler
 * Manages the Orientation section of the order
 */

const OrientationSection = {
  /**
   * Get field mappings for this section
   * @returns {Object} - Field ID to data path mapping
   */
  getFieldMappings() {
    return {
      'present-location': 'orientation.presentLocation',
      'direction-azimuth': 'orientation.directionAzimuth',
      'direction-distance': 'orientation.directionDistance',
      'objective-location': 'orientation.objectiveLocation',
      'kocoa-key-terrain': 'orientation.kocoa.keyTerrain',
      'kocoa-observation': 'orientation.kocoa.observation',
      'kocoa-cover': 'orientation.kocoa.cover',
      'kocoa-obstacles': 'orientation.kocoa.obstacles',
      'kocoa-avenues': 'orientation.kocoa.avenues',
      'weather': 'orientation.weather'
    };
  },

  /**
   * Get help content for this section
   * @returns {Object} - Help title and content
   */
  getHelpContent() {
    return {
      title: 'Orientation Help',
      content: `
        <h4>Purpose</h4>
        <p>Orient your unit to the terrain, enemy, and situation before issuing the order.</p>

        <h4>KOCOA - Terrain Analysis</h4>
        <ul>
          <li><strong>K</strong>ey Terrain - Ground that provides a marked advantage</li>
          <li><strong>O</strong>bservation & Fields of Fire - Areas with good observation</li>
          <li><strong>C</strong>over & Concealment - Protection from fire and observation</li>
          <li><strong>O</strong>bstacles - Natural and man-made barriers</li>
          <li><strong>A</strong>venues of Approach - Routes for movement</li>
        </ul>

        <h4>Tips</h4>
        <ul>
          <li>Use 8-digit MGRS grid coordinates</li>
          <li>Azimuth should be magnetic (not grid)</li>
          <li>Consider weather effects on visibility and mobility</li>
        </ul>
      `
    };
  },

  /**
   * Check if section has data
   * @param {Object} data - Order data
   * @returns {boolean} - Whether section has data
   */
  hasData(data) {
    const o = data.orientation;
    return !!(
      o.presentLocation ||
      o.directionAzimuth ||
      o.objectiveLocation ||
      o.kocoa.keyTerrain ||
      o.kocoa.observation ||
      o.kocoa.cover ||
      o.kocoa.obstacles ||
      o.kocoa.avenues ||
      o.weather
    );
  }
};
