/**
 * Storage Module
 * Handles saving and loading orders from localStorage
 */

const Storage = {
  ORDERS_KEY: 'osmeac-orders',
  CURRENT_KEY: 'osmeac-current',

  /**
   * Save data to localStorage
   * @param {string} key - Storage key
   * @param {*} data - Data to save
   * @returns {boolean} - Success status
   */
  save(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error('Storage save error:', e);
      return false;
    }
  },

  /**
   * Load data from localStorage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if not found
   * @returns {*} - Loaded data or default
   */
  load(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error('Storage load error:', e);
      return defaultValue;
    }
  },

  /**
   * Remove item from localStorage
   * @param {string} key - Storage key
   */
  remove(key) {
    localStorage.removeItem(key);
  },

  /**
   * Get all saved orders
   * @returns {Array} - Array of saved orders
   */
  getOrders() {
    return this.load(this.ORDERS_KEY, []);
  },

  /**
   * Save a new order
   * @param {string} name - Order name
   * @param {Object} orderData - Order data
   * @returns {boolean} - Success status
   */
  saveOrder(name, orderData) {
    const orders = this.getOrders();
    const order = {
      id: Date.now().toString(),
      name: name,
      data: orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    orders.push(order);
    return this.save(this.ORDERS_KEY, orders);
  },

  /**
   * Update an existing order
   * @param {string} id - Order ID
   * @param {Object} orderData - Updated order data
   * @returns {boolean} - Success status
   */
  updateOrder(id, orderData) {
    const orders = this.getOrders();
    const index = orders.findIndex(o => o.id === id);
    if (index !== -1) {
      orders[index].data = orderData;
      orders[index].updatedAt = new Date().toISOString();
      return this.save(this.ORDERS_KEY, orders);
    }
    return false;
  },

  /**
   * Delete an order
   * @param {string} id - Order ID
   * @returns {boolean} - Success status
   */
  deleteOrder(id) {
    const orders = this.getOrders();
    const filtered = orders.filter(o => o.id !== id);
    return this.save(this.ORDERS_KEY, filtered);
  },

  /**
   * Get a specific order by ID
   * @param {string} id - Order ID
   * @returns {Object|null} - Order or null
   */
  getOrder(id) {
    const orders = this.getOrders();
    return orders.find(o => o.id === id) || null;
  },

  /**
   * Save current working order
   * @param {Object} orderData - Current order data
   */
  saveCurrent(orderData) {
    this.save(this.CURRENT_KEY, orderData);
  },

  /**
   * Load current working order
   * @returns {Object} - Current order data
   */
  loadCurrent() {
    return this.load(this.CURRENT_KEY, this.getEmptyOrder());
  },

  /**
   * Clear current working order
   */
  clearCurrent() {
    this.remove(this.CURRENT_KEY);
  },

  /**
   * Get empty order template
   * @returns {Object} - Empty order structure
   */
  getEmptyOrder() {
    return {
      orientation: {
        presentLocation: '',
        directionAzimuth: '',
        directionDistance: '',
        objectiveLocation: '',
        kocoa: {
          keyTerrain: '',
          observation: '',
          cover: '',
          obstacles: '',
          avenues: ''
        },
        weather: ''
      },
      situation: {
        salute: {
          size: '',
          activity: '',
          location: '',
          unit: '',
          time: '',
          equipment: ''
        },
        drawd: {
          defend: '',
          reinforce: '',
          attack: '',
          withdraw: '',
          delay: ''
        },
        emlcoa: '',
        emdcoa: '',
        friendly: {
          higherMission: '',
          higherIntent: '',
          adjacentNorth: '',
          adjacentSouth: '',
          adjacentEast: '',
          adjacentWest: '',
          supportingUnits: ''
        },
        attachments: ''
      },
      mission: {
        who: '',
        what: '',
        whatCustom: '',
        where: '',
        when: '',
        why: ''
      },
      execution: {
        intent: {
          purpose: '',
          method: '',
          endstateFriendly: '',
          endstateEnemy: '',
          endstateTerrain: ''
        },
        concept: {
          schemeManeuver: '',
          fireSupport: ''
        },
        tasks: {
          team1: '',
          team2: '',
          team3: '',
          attachments: ''
        },
        coordinating: {
          timeline: '',
          priorityFires: '',
          roe: '',
          mopp: '',
          contact: '',
          objective: '',
          consolidation: '',
          formation: '',
          technique: '',
          departure: ''
        }
      },
      admin: {
        administration: {
          epw: '',
          captured: ''
        },
        logistics: {
          ammo: '',
          rations: '',
          water: '',
          equipment: '',
          resupply: ''
        },
        casevac: {
          collection: '',
          route: '',
          medical: ''
        }
      },
      command: {
        command: {
          location: '',
          succession: '',
          cp: ''
        },
        frequencies: {
          primary: '',
          alternate: '',
          contingency: '',
          emergency: ''
        },
        callsigns: {
          higher: '',
          thisUnit: '',
          subordinates: ''
        },
        signals: {
          shiftFire: '',
          ceaseFire: '',
          assault: '',
          rally: ''
        },
        pyrotechnics: '',
        challengePassword: '',
        runningPassword: '',
        numberCombo: '',
        timeHack: ''
      }
    };
  }
};
