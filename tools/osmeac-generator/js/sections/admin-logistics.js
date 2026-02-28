/**
 * Admin & Logistics Section Handler
 * Manages the Admin & Logistics section of the order
 */

const AdminLogisticsSection = {
  /**
   * Get field mappings for this section
   * @returns {Object} - Field ID to data path mapping
   */
  getFieldMappings() {
    return {
      'admin-epw': 'admin.administration.epw',
      'admin-captured': 'admin.administration.captured',
      'log-ammo': 'admin.logistics.ammo',
      'log-rations': 'admin.logistics.rations',
      'log-water': 'admin.logistics.water',
      'log-equipment': 'admin.logistics.equipment',
      'log-resupply': 'admin.logistics.resupply',
      'casevac-collection': 'admin.casevac.collection',
      'casevac-route': 'admin.casevac.route',
      'casevac-medical': 'admin.casevac.medical'
    };
  },

  /**
   * Get help content for this section
   * @returns {Object} - Help title and content
   */
  getHelpContent() {
    return {
      title: 'Admin & Logistics Help',
      content: `
        <h4>Purpose</h4>
        <p>Cover all administrative and logistical matters that support the mission.</p>

        <h4>Administration</h4>
        <ul>
          <li><strong>EPW Handling</strong> - What to do with prisoners</li>
          <li><strong>Captured Material</strong> - How to handle captured equipment and documents</li>
        </ul>

        <h4>Logistics</h4>
        <ul>
          <li><strong>Ammunition</strong> - Combat load, special munitions</li>
          <li><strong>Rations</strong> - Food and meal plan</li>
          <li><strong>Water</strong> - Water source and resupply</li>
          <li><strong>Special Equipment</strong> - Any additional gear needed</li>
          <li><strong>Resupply Point</strong> - Where to get more supplies</li>
        </ul>

        <h4>CASEVAC</h4>
        <ul>
          <li><strong>Collection Point</strong> - Where casualties are brought</li>
          <li><strong>Route</strong> - Path to medical support</li>
          <li><strong>Medical Support</strong> - Available medical assets</li>
        </ul>

        <h4>Tips</h4>
        <ul>
          <li>Everyone should know the CASEVAC plan</li>
          <li>Use 8-digit grids for precise locations</li>
          <li>Consider backup resupply options</li>
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
    const a = data.admin;
    return !!(
      a.administration.epw ||
      a.logistics.ammo ||
      a.logistics.rations ||
      a.casevac.collection ||
      a.casevac.route
    );
  }
};
