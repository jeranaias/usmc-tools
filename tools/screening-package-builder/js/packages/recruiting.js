/**
 * Recruiting Duty Package Template
 * Based on MCO 1326.6 (SCREENMAN)
 * Authority: MCO 1326.6, Annual SDA MARADMINs
 */
const RecruitingPackage = {
  id: 'recruiting',
  name: 'Recruiting Duty',
  shortName: 'REC',
  icon: '&#127894;',
  description: 'B-Billet Special Duty Assignment',
  reference: 'MCO 1326.6 (SCREENMAN)',
  referenceUrl: 'https://www.marines.mil/News/Publications/MCPEL/Electronic-Library-Display/Article/1760838/mco-13266-ch-1/',

  // Eligibility requirements
  eligibility: {
    tourLength: '36 months',
    pft: '1st Class PFT',
    cft: '1st Class CFT',
    conduct: 'No NJP within 24 months, no courts-martial',
    financial: 'Favorable credit check required',
    driving: 'Valid license, favorable driving record',
    heightWeight: 'Within standards',
    clearance: 'Eligible for Secret'
  },

  // Step-by-step phases
  phases: [
    {
      id: 1,
      name: 'Volunteer',
      description: 'Express interest and verify eligibility',
      estimatedDuration: '1 week',
      documents: [3]
    },
    {
      id: 2,
      name: 'Screening',
      description: 'Command screening and HQMC approval',
      estimatedDuration: '2-4 weeks',
      documents: [1, 2],
      critical: true
    },
    {
      id: 3,
      name: 'Records',
      description: 'Gather personnel and fitness records',
      estimatedDuration: '1-2 weeks',
      documents: [4, 5, 6, 7]
    },
    {
      id: 4,
      name: 'Medical/Dental',
      description: 'Complete medical and dental requirements',
      estimatedDuration: '2-4 weeks',
      documents: [8, 9]
    },
    {
      id: 5,
      name: 'Administrative',
      description: 'Complete administrative documents',
      estimatedDuration: '2 weeks',
      documents: [10, 11, 12, 13, 14, 15, 16]
    },
    {
      id: 6,
      name: 'Submission',
      description: 'Submit package and await selection',
      estimatedDuration: 'Varies',
      documents: [17, 18]
    }
  ],

  // Default routing chain
  defaultRouting: [
    {
      level: 'Company Commander',
      required: true,
      description: 'Initial screening interview and endorsement',
      format: 'CO Screening/Interview Guide'
    },
    {
      level: 'Battalion Commander',
      required: true,
      description: 'Intermediate endorsement',
      format: 'Endorsement with recommendation'
    },
    {
      level: 'Submit to Recruiting District',
      required: true,
      description: 'Via S-1/personnel channels',
      format: 'Complete screening package'
    }
  ],

  // Waiver categories
  waiverCategories: [
    { id: 'pft', name: 'PFT Score', description: 'Below 1st class PFT requirement' },
    { id: 'cft', name: 'CFT Score', description: 'Below 1st class CFT requirement' },
    { id: 'height_weight', name: 'Height/Weight', description: 'Outside body composition standards' },
    { id: 'driving', name: 'Driving Record', description: 'DUI, serious traffic violations, or suspended license' },
    { id: 'financial', name: 'Financial Issues', description: 'Derogatory credit, collections, bankruptcy' },
    { id: 'njp', name: 'NJP History', description: 'Non-judicial punishment within 24 months' },
    { id: 'tig_tis', name: 'TIG/TIS', description: 'Does not meet time requirements' },
    { id: 'tattoo', name: 'Tattoo Policy', description: 'Tattoos requiring waiver per MCO 1020.34H' }
  ],

  // Document checklist with detailed guidance
  documents: [
    // SCREENING DOCUMENTS
    {
      id: 1,
      category: 'Screening',
      name: 'CO Screening/Interview Guide',
      description: 'Commanding Officer interview and screening documentation. Critical first step.',
      required: true,
      phase: 2,
      formUrl: 'https://www.marforres.marines.mil/Portals/116/Docs/G-1/IPAC/Documents/Checklist/Recruiter%20Checklist.pdf',
      reference: 'MCO 1326.6',
      instructions: [
        'CO conducts formal screening interview',
        'Complete all sections of screening guide',
        'CO assesses motivation, character, suitability',
        'Document any concerns or waiver requirements',
        'CO signature required'
      ],
      tips: [
        'Prepare for interview - know why you want recruiting duty',
        'Be honest about any potential issues',
        'Dress professionally for interview'
      ]
    },
    {
      id: 2,
      category: 'Screening',
      name: 'HQMC MISSA Screening',
      description: 'HQMC screening certification through MISSA system.',
      required: true,
      phase: 2,
      reference: 'Initiated by S-1 via HQMC',
      instructions: [
        'S-1 initiates screening request to HQMC',
        'MISSA screening verifies eligibility',
        'Results returned to command',
        'Include screening results in package'
      ],
      tips: [
        'This is initiated by your S-1, not you',
        'Follow up to ensure it was submitted',
        'Can take 1-2 weeks for results'
      ]
    },
    {
      id: 3,
      category: 'Screening',
      name: 'Volunteer Statement',
      description: 'Written statement expressing desire to volunteer for recruiting duty.',
      required: true,
      phase: 1,
      reference: 'Signed statement, SECNAV M-5216.5 format',
      instructions: [
        'Write statement expressing desire to volunteer',
        'Use proper naval letter format',
        'Address why you want recruiting duty',
        'Sign and date',
        'Submit through chain of command'
      ],
      format: {
        from: 'Rank First MI. Last, USMC',
        to: 'Commanding Officer, [Unit]',
        subj: 'REQUEST FOR ASSIGNMENT TO RECRUITING DUTY',
        content: 'Express motivation and qualifications'
      },
      tips: [
        'Be sincere about your motivations',
        'Highlight relevant experience (leadership, public speaking)',
        'Keep it professional and concise'
      ]
    },

    // PERSONNEL RECORDS
    {
      id: 4,
      category: 'Records',
      name: 'BIR/BTR Screen',
      description: 'Basic Individual Record from Marine Online (MOL).',
      required: true,
      phase: 3,
      systemUrl: 'https://mol.tfs.usmc.mil/',
      reference: 'Print from MOL',
      instructions: [
        'Log into MOL',
        'Navigate to My Record > Official Record',
        'Print BIR screen',
        'Verify all information is accurate'
      ]
    },
    {
      id: 5,
      category: 'Records',
      name: 'Awards Summary',
      description: 'Official awards record from MCTFS.',
      required: true,
      phase: 3,
      systemUrl: 'https://tfs.usmc.mil/',
      reference: 'Print from MCTFS',
      instructions: [
        'Access MCTFS',
        'Print awards screen',
        'Verify all awards are posted'
      ]
    },
    {
      id: 6,
      category: 'Records',
      name: 'PFT/CFT Scores',
      description: 'Current fitness scores - 1st class required for both PFT and CFT.',
      required: true,
      phase: 3,
      systemUrl: 'https://tfs.usmc.mil/',
      reference: 'Print from MCTFS',
      instructions: [
        'Print official PFT/CFT scores from MCTFS',
        'Must be 1st class on both',
        'Scores must be current (within FY)'
      ],
      tips: [
        'If not 1st class, improve scores before applying',
        'Waivers for fitness are rarely granted',
        '1st class is minimum - higher is better'
      ]
    },
    {
      id: 7,
      category: 'Records',
      name: 'Height/Weight Record',
      description: 'Most recent body composition measurement. Include BCP status if applicable.',
      required: true,
      phase: 3,
      reference: 'From medical or S-3',
      instructions: [
        'Obtain most recent height/weight measurement',
        'Must be within standards',
        'If on BCP, include current status',
        'May require waiver if not within standards'
      ],
      tips: [
        'Being on BCP may disqualify you',
        'Work on body composition before applying',
        'Recruiting requires professional appearance'
      ]
    },

    // MEDICAL DOCUMENTS
    {
      id: 8,
      category: 'Medical',
      name: 'Physical Examination',
      description: 'Current physical examination within 2 years. DD 2808 or equivalent.',
      required: true,
      phase: 4,
      formUrl: 'https://www.esd.whs.mil/Portals/54/Documents/DD/forms/dd/dd2808.pdf',
      reference: 'DD 2808 or equivalent, within 2 years',
      instructions: [
        'Schedule physical through medical department',
        'Must be within 2 years of application',
        'DD 2808 is preferred but equivalent accepted',
        'Ensure all sections completed'
      ]
    },
    {
      id: 9,
      category: 'Medical',
      name: 'Dental Readiness',
      description: 'Must be Dental Class 1 or 2 - no outstanding dental issues.',
      required: true,
      phase: 4,
      reference: 'Dental classification from dental clinic',
      instructions: [
        'Obtain dental readiness classification',
        'Must be Class 1 or Class 2',
        'Class 3 or 4 requires treatment before approval',
        'Get documentation from dental clinic'
      ],
      tips: [
        'Schedule dental appointment early',
        'Complete any required dental work',
        'Get written verification of class'
      ]
    },

    // ADMINISTRATIVE DOCUMENTS
    {
      id: 10,
      category: 'Admin',
      name: 'Credit Check Authorization',
      description: 'Signed authorization allowing credit history check.',
      required: true,
      phase: 5,
      reference: 'Signed authorization form',
      instructions: [
        'Sign credit check authorization form',
        'Obtain from S-1 or screening coordinator',
        'Authorizes HQMC to pull credit report'
      ],
      tips: [
        'Be aware of your credit situation beforehand',
        'Address any issues proactively',
        'Review your own credit report first'
      ]
    },
    {
      id: 11,
      category: 'Admin',
      name: 'Credit Report',
      description: 'Current credit report within 30 days. Favorable credit required.',
      required: true,
      phase: 5,
      reference: 'Within 30 days, from authorized source',
      instructions: [
        'Obtain credit report from authorized source',
        'Must be within 30 days of submission',
        'Review for any derogatory information',
        'Be prepared to explain any issues'
      ],
      tips: [
        'Free annual report from annualcreditreport.com',
        'Address collections/delinquencies before applying',
        'Recruiters handle money - financial responsibility critical'
      ]
    },
    {
      id: 12,
      category: 'Admin',
      name: 'Driver\'s License Copy',
      description: 'Valid state driver\'s license - front and back copies.',
      required: true,
      phase: 5,
      reference: 'Clear copy of front and back',
      instructions: [
        'Make clear copy of front and back of license',
        'Must be valid (not expired)',
        'Verify address is current',
        'Include any endorsements'
      ],
      tips: [
        'Recruiters drive government vehicles',
        'Valid license is mandatory for duty',
        'Renew if expiring soon'
      ]
    },
    {
      id: 13,
      category: 'Admin',
      name: 'Driving Record (MVR)',
      description: 'Motor Vehicle Record from state DMV within 30 days.',
      required: true,
      phase: 5,
      reference: 'State DMV, within 30 days',
      instructions: [
        'Request MVR from your state DMV',
        'Must be within 30 days of submission',
        'Shows all traffic violations and accidents',
        'DUI/DWI or serious violations may be disqualifying'
      ],
      tips: [
        'Order online from most state DMVs',
        'May take several days to receive',
        'Review for accuracy'
      ]
    },
    {
      id: 14,
      category: 'Admin',
      name: 'SGLI Election',
      description: 'Current SGLI coverage documentation via SOES.',
      required: true,
      phase: 5,
      formUrl: 'https://www.benefits.va.gov/insurance/forms/SGLV-8286.pdf',
      systemUrl: 'https://milconnect.dmdc.osd.mil/milconnect/',
      reference: 'SGLV 8286 or SOES printout',
      instructions: [
        'Access SOES via milConnect',
        'Verify beneficiary information is current',
        'Print verification of coverage',
        'Update if needed through SOES'
      ],
      tips: [
        'SOES is preferred over paper form',
        'Review beneficiaries annually'
      ]
    },
    {
      id: 15,
      category: 'Admin',
      name: 'Dependent Information',
      description: 'Page 2 or DEERS printout with current dependent information.',
      required: true,
      phase: 5,
      systemUrl: 'https://milconnect.dmdc.osd.mil/',
      reference: 'Current DEERS printout',
      instructions: [
        'Access DEERS via milConnect',
        'Verify all dependents are current',
        'Print dependent verification',
        'Update if information has changed'
      ]
    },
    {
      id: 16,
      category: 'Admin',
      name: 'Emergency Contact Info',
      description: 'Current DD Form 93 with emergency contact and beneficiary information.',
      required: true,
      phase: 5,
      formUrl: 'https://www.esd.whs.mil/Portals/54/Documents/DD/forms/dd/dd0093.pdf',
      reference: 'DD Form 93',
      instructions: [
        'Verify DD 93 is current',
        'Update emergency contacts if needed',
        'Update beneficiary information if needed',
        'Submit updates through S-1'
      ]
    },

    // PERSONAL DOCUMENTS
    {
      id: 17,
      category: 'Personal',
      name: 'Official Photo',
      description: 'Recent official photo in service uniform within 6 months.',
      required: true,
      phase: 6,
      reference: 'Within 6 months, service uniform',
      instructions: [
        'Schedule official photo at base photo lab',
        'Wear service uniform (Alpha or Bravo)',
        'Must be within 6 months of submission',
        'Professional appearance required'
      ],
      tips: [
        'Fresh haircut before photo',
        'Ensure ribbons/badges are correct',
        'Professional expression - no grinning'
      ]
    },
    {
      id: 18,
      category: 'Personal',
      name: 'Biography/Resume',
      description: 'Personal biography or military resume highlighting qualifications.',
      required: false,
      phase: 6,
      reference: 'Optional but recommended',
      instructions: [
        'Prepare professional biography',
        'Highlight leadership experience',
        'Include civilian education and skills',
        'Keep to one page'
      ],
      tips: [
        'Emphasize communication and leadership skills',
        'Include any sales or public relations experience',
        'Professional format'
      ]
    }
  ],

  // Create package instance
  createPackage(applicantInfo = {}) {
    return {
      id: Storage.generatePackageId(),
      packageType: this.id,
      packageName: this.name,

      // Applicant info
      applicantName: applicantInfo.name || '',
      applicantRank: applicantInfo.rank || '',
      applicantEDIPI: applicantInfo.edipi || '',
      applicantMOS: applicantInfo.mos || '',
      applicantUnit: applicantInfo.unit || '',
      preferredDistrict: applicantInfo.preferredDistrict || '',
      deadline: applicantInfo.deadline || '',

      // Current phase tracking
      currentPhase: 1,

      // Documents with status
      documents: this.documents.map(doc => ({
        ...doc,
        status: 'incomplete',
        notes: '',
        dateCompleted: null,
        attachments: []
      })),

      // Waivers
      waivers: [],

      // Routing
      routing: this.defaultRouting.map((step, index) => ({
        ...step,
        id: index + 1,
        name: '',
        status: 'pending',
        date: null,
        recommends: null
      })),

      // Metadata
      created: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
      status: 'in_progress'
    };
  }
};
