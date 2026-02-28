/**
 * Warrant Officer Package Template
 * Based on MCO 1040.42B and MCRC Sample Application
 * Authority: MCO 1040.42B, Annual WO Selection Board MARADMIN
 */
const WarrantOfficerPackage = {
  id: 'warrant_officer',
  name: 'Warrant Officer',
  shortName: 'WO',
  icon: '&#9733;',
  description: 'Regular & Reserve Commissioning Program',
  reference: 'MCO 1040.42B',
  referenceUrl: 'https://www.marines.mil/News/Publications/MCPEL/Electronic-Library-Display/Article/1918113/mco-104042b/',

  // Eligibility requirements
  eligibility: {
    timeInService: { min: 8, max: 22, unit: 'years', note: 'Reserve: 8-26 years' },
    timeInGrade: { sgt: 2, ssgt: 1, unit: 'years' },
    gtScore: { min: 110, waiverable: 100 },
    pft: '1st Class within 12 months',
    conduct: 'No court-martial convictions',
    clearance: 'Eligible for Secret minimum'
  },

  // Step-by-step phases
  phases: [
    {
      id: 1,
      name: 'Eligibility Check',
      description: 'Verify you meet all requirements before starting',
      estimatedDuration: '1-2 weeks',
      documents: []
    },
    {
      id: 2,
      name: 'Medical Processing',
      description: 'Complete commissioning physical - START THIS FIRST',
      estimatedDuration: '4-8 weeks',
      documents: [14, 15, 16, 17, 18, 19],
      critical: true,
      warning: 'Begin immediately - medical waivers can take months'
    },
    {
      id: 3,
      name: 'Records Verification',
      description: 'Gather and verify all personnel records',
      estimatedDuration: '2-4 weeks',
      documents: [5, 6, 7, 8, 9, 12]
    },
    {
      id: 4,
      name: 'Application Prep',
      description: 'Prepare application letter and supporting documents',
      estimatedDuration: '1-2 weeks',
      documents: [1, 3, 10, 11, 13]
    },
    {
      id: 5,
      name: 'Command Endorsement',
      description: 'Route through chain of command',
      estimatedDuration: '2-4 weeks',
      documents: [2, 4]
    },
    {
      id: 6,
      name: 'Submission',
      description: 'Submit via DoD SAFE to MCRC',
      estimatedDuration: '1 week',
      documents: []
    }
  ],

  // Default routing chain
  defaultRouting: [
    {
      level: 'Company Commander',
      required: true,
      description: 'Initial endorsement - first in chain',
      format: 'First endorsement on NAVMC 10274'
    },
    {
      level: 'Battalion Commander',
      required: true,
      description: 'Intermediate endorsement',
      format: 'Second endorsement'
    },
    {
      level: 'First O-6 in Chain',
      required: true,
      description: 'Required senior endorsement',
      format: 'Third endorsement - must be O-6 or higher'
    },
    {
      level: 'Submit to MCRC',
      required: true,
      description: 'warrantofficerboard@marines.usmc.mil via DoD SAFE',
      format: 'Complete package in PDF format'
    }
  ],

  // Waiver categories
  waiverCategories: [
    { id: 'gt', name: 'GT Score', description: 'GT below 110 (minimum 100 with waiver)' },
    { id: 'afqt', name: 'AFQT Score', description: 'AFQT below required threshold' },
    { id: 'njp', name: 'NJP History', description: 'Non-judicial punishment on record' },
    { id: 'courtsmartial', name: 'Courts-Martial', description: 'Prior courts-martial (highly unlikely to be waived)' },
    { id: 'civil', name: 'Civil Conviction', description: 'Non-felony civil conviction' },
    { id: 'preservice', name: 'Pre-Service Issues', description: 'Drug use, moral waivers at enlistment' },
    { id: 'tattoo', name: 'Tattoo Policy', description: 'Tattoos requiring waiver per MCO 1020.34H' },
    { id: 'medical', name: 'Medical Conditions', description: 'Conditions not meeting DoDI 6130.03' },
    { id: 'tig_tis', name: 'TIG/TIS', description: 'Does not meet time requirements' }
  ],

  // Document checklist with detailed guidance
  documents: [
    // APPLICATION DOCUMENTS
    {
      id: 1,
      category: 'Application',
      name: 'Application Letter',
      description: 'NAVMC 10274 format stating intent to apply. Include 100-500 word essay on motivation, experience, and qualifications.',
      required: true,
      phase: 4,
      formId: 'NAVMC_10274',
      formUrl: null,
      reference: 'MCO 1040.42B, MCRC Sample Application',
      referenceUrl: 'https://www.mcrc.marines.mil/Officer-Programs/Warrant-Officer/',
      instructions: [
        'Use NAVMC 10274 Administrative Action format',
        'SSIC: 1040 (Officer Programs)',
        'FROM: Your Rank, First MI. Last, USMC',
        'TO: Commandant of the Marine Corps (MMOA-3)',
        'VIA: Chain of command (each endorser)',
        'SUBJ: APPLICATION FOR THE WARRANT OFFICER PROGRAM',
        'Include 100-500 word essay - address motivation, leadership, technical expertise',
        'Follow SECNAV M-5216.5 formatting'
      ],
      format: {
        font: '12pt Times New Roman',
        margins: '1 inch all sides',
        spacing: 'Single-spaced, double between paragraphs'
      },
      tips: [
        'Review sample application on MCRC website',
        'Have someone proofread before submission',
        'Be specific about your technical contributions',
        'Address any potential concerns (waivers) directly'
      ]
    },
    {
      id: 2,
      category: 'Application',
      name: 'CO Interview/Recommendation',
      description: 'Commanding Officer conducts interview and provides written recommendation endorsement.',
      required: true,
      phase: 5,
      reference: 'MCO 1040.42B para 4.b',
      instructions: [
        'Schedule interview with Commanding Officer',
        'CO will assess leadership potential, character, motivation',
        'CO endorsement becomes first endorsement on application',
        'Endorsement should address recommendation (favorable/unfavorable)'
      ],
      tips: [
        'Prepare talking points about your qualifications',
        'Be ready to discuss any adverse information',
        'Bring your service record summary'
      ]
    },
    {
      id: 3,
      category: 'Application',
      name: 'Command Screening Checklist',
      description: 'NAVMC 11580 - comprehensive command screening form.',
      required: true,
      phase: 4,
      formId: 'NAVMC_11580',
      formUrl: 'https://www.usmcu.edu/Portals/218/CEME/Documents/Information/CEME%20Command%20Screening%20Checklist%20and%20Duty%20Status%20Waiver.pdf',
      reference: 'NAVMC 11580',
      instructions: [
        'Complete all sections applicable to WO program',
        'Coordinate with S-1 for personnel data',
        'Obtain CO signature',
        'Include duty status waiver if not on full duty (pages 3-6)'
      ]
    },
    {
      id: 4,
      category: 'Application',
      name: 'First O-6 Endorsement',
      description: 'Required endorsement from first O-6 in chain of command.',
      required: true,
      phase: 5,
      reference: 'MCO 1040.42B',
      instructions: [
        'Route through all intermediate commanders',
        'O-6 provides final endorsement before MCRC submission',
        'Must specifically recommend favorable/unfavorable'
      ]
    },

    // PERSONNEL RECORDS
    {
      id: 5,
      category: 'Records',
      name: 'BIR/BTR Screen',
      description: 'Basic Individual Record and Basic Training Record from MOL showing service history.',
      required: true,
      phase: 3,
      systemUrl: 'https://mol.tfs.usmc.mil/',
      reference: 'Print from Marine Online (MOL)',
      instructions: [
        'Log into MOL',
        'Navigate to My Record > Official Record',
        'Print BIR and BTR screens',
        'Verify all information is accurate',
        'Submit corrections through S-1 if needed'
      ],
      tips: [
        'Check for missing duty stations or gaps',
        'Verify rank/date of rank is correct',
        'Corrections can take 2-4 weeks - start early'
      ]
    },
    {
      id: 6,
      category: 'Records',
      name: 'Education Screen',
      description: 'Official education record showing PME, MCI, and college credits.',
      required: true,
      phase: 3,
      systemUrl: 'https://tfs.usmc.mil/',
      reference: 'Print from MCTFS',
      instructions: [
        'Access MCTFS',
        'Print education screen',
        'Verify all PME is posted (Corporals Course, Sergeants Course, etc.)',
        'Verify MCI courses are posted',
        'Verify college credits/degrees if applicable'
      ],
      tips: [
        'Request JST transcript for degree verification',
        'Submit missing PME through S-3',
        'College credits should be on official transcript'
      ]
    },
    {
      id: 7,
      category: 'Records',
      name: 'Awards Screen',
      description: 'Complete record of all personal and unit awards.',
      required: true,
      phase: 3,
      systemUrl: 'https://tfs.usmc.mil/',
      reference: 'Print from MCTFS',
      instructions: [
        'Print awards screen from MCTFS',
        'Verify all awards are posted',
        'Submit missing awards with citations through S-1'
      ],
      tips: [
        'Include campaign medals and unit awards',
        'Awards demonstrate sustained superior performance',
        'Keep copies of award citations'
      ]
    },
    {
      id: 8,
      category: 'Records',
      name: 'Chronological Page',
      description: 'Service record chronology showing all assignments and significant events.',
      required: true,
      phase: 3,
      systemUrl: 'https://tfs.usmc.mil/',
      reference: 'Print from MCTFS',
      instructions: [
        'Print chronological record from MCTFS',
        'Verify completeness and accuracy',
        'Should show all duty stations and dates'
      ]
    },
    {
      id: 9,
      category: 'Records',
      name: 'Test Score Screen (ASVAB)',
      description: 'Official ASVAB scores including GT and line scores. Must meet minimum GT of 110 (or 100 with waiver).',
      required: true,
      phase: 3,
      systemUrl: 'https://tfs.usmc.mil/',
      reference: 'Print from MCTFS',
      instructions: [
        'Print official test score screen from MCTFS',
        'Verify GT score meets minimum (110, or 100 with waiver)',
        'For certain MOSs, verify EL or other line scores meet requirements'
      ],
      tips: [
        'If GT is below 110, you will need a waiver',
        'Consider retesting if scores are low',
        'Some MOS require specific line scores'
      ]
    },

    // ADMINISTRATIVE DOCUMENTS
    {
      id: 10,
      category: 'Admin',
      name: 'NAVMC 941 Counseling Checklist',
      description: 'Counseling checklist documenting acknowledgment of program requirements.',
      required: true,
      phase: 4,
      reference: 'NAVMC 941',
      instructions: [
        'Complete all applicable items',
        'Sign and date',
        'Career planner or S-1 can assist'
      ]
    },
    {
      id: 11,
      category: 'Admin',
      name: 'SAT/ACT Scores',
      description: 'Certified copy of SAT/ACT scores if available. Optional but provides education points.',
      required: false,
      phase: 4,
      reference: 'Optional enhancement',
      instructions: [
        'Request official score report from testing agency',
        'Include only if scores are competitive'
      ],
      tips: [
        'Not required but can enhance package',
        'Consider taking if you have time before deadline'
      ]
    },
    {
      id: 12,
      category: 'Admin',
      name: 'Security Clearance Verification',
      description: 'DISS screen or Page 11 entry verifying clearance eligibility. Minimum Secret required.',
      required: true,
      phase: 3,
      systemUrl: 'https://www.dcsa.mil/is/diss/',
      reference: 'DISS (formerly JPAS) print',
      instructions: [
        'Contact S-2 for DISS verification',
        'Obtain printed verification of clearance level',
        'If investigation pending, include status',
        'Page 11 entry is acceptable if DISS unavailable'
      ],
      tips: [
        'Start reinvestigation early if clearance expiring',
        'Investigations can take 6-12 months',
        'Some WO MOS require TS/SCI'
      ]
    },
    {
      id: 13,
      category: 'Admin',
      name: 'Tattoo Documentation',
      description: 'Photos of all tattoos and body markings. Include waiver documentation if required.',
      required: true,
      phase: 4,
      reference: 'MCO 1020.34H',
      referenceUrl: 'https://www.marines.mil/News/Publications/MCPEL/',
      instructions: [
        'Photograph all visible tattoos clearly',
        'Include location description for each',
        'If tattoos require waiver, include waiver package',
        'Photos should be in color, clear, and well-lit'
      ],
      tips: [
        'No tattoos on head, neck, hands (limited exceptions)',
        'No content that is obscene, gang-related, or discriminatory',
        'Consult S-1 if unsure about policy compliance'
      ]
    },

    // MEDICAL DOCUMENTS
    {
      id: 14,
      category: 'Medical',
      name: 'DD Form 2807-1',
      description: 'Report of Medical History. Complete medical history questionnaire - all blocks must be completed.',
      required: true,
      phase: 2,
      formId: 'DD_2807_1',
      formUrl: 'https://www.esd.whs.mil/Portals/54/Documents/DD/forms/dd/dd2807-1.pdf',
      reference: 'DD 2807-1, DoDI 6130.03',
      instructions: [
        'Download fillable PDF from ESD.whs.mil',
        'Complete ALL blocks - do not leave any blank',
        'Answer all medical history questions truthfully',
        'List ALL surgeries, hospitalizations, medications',
        'Gather supporting documentation for any conditions',
        'Sign and date'
      ],
      tips: [
        'Review your medical records before completing',
        'Disclose everything - hidden conditions disqualify you later',
        'Get copies of records for disclosed conditions'
      ]
    },
    {
      id: 15,
      category: 'Medical',
      name: 'DD Form 2808',
      description: 'Report of Medical Examination. Commissioning physical conducted by military physician.',
      required: true,
      phase: 2,
      formId: 'DD_2808',
      formUrl: 'https://www.esd.whs.mil/Portals/54/Documents/DD/forms/dd/dd2808.pdf',
      reference: 'DD 2808, DoDI 6130.03',
      instructions: [
        'Schedule physical through medical department',
        'May require MEPS or larger medical facility',
        'Bring completed DD 2807-1 to appointment',
        'Fasting may be required for bloodwork',
        'Bring glasses/contacts and prescription',
        'Physical valid for 24 months'
      ],
      tips: [
        'Schedule 60+ days before deadline - waivers take time',
        'Wear comfortable clothing for examination',
        'Bring list of all medications'
      ]
    },
    {
      id: 16,
      category: 'Medical',
      name: 'IMR Screen',
      description: 'Individual Medical Readiness printout from MOL.',
      required: true,
      phase: 2,
      systemUrl: 'https://mol.tfs.usmc.mil/',
      reference: 'Print from MOL',
      instructions: [
        'Log into MOL',
        'Navigate to Medical Readiness',
        'Print IMR screen',
        'Should show current medical readiness status'
      ]
    },
    {
      id: 17,
      category: 'Medical',
      name: 'Audiogram',
      description: 'Hearing test results. Must be within 3 years of board date and annotated on DD 2808.',
      required: true,
      phase: 2,
      reference: 'Within 3 years, annotated on DD 2808',
      instructions: [
        'Schedule audiogram through medical',
        'Results annotated on DD 2808',
        'Must be within 3 years of board convening'
      ],
      tips: [
        'Avoid loud noise 24 hours before test',
        'Hearing loss may require waiver'
      ]
    },
    {
      id: 18,
      category: 'Medical',
      name: 'PAP Results (Female)',
      description: 'PAP smear results within 3 years. Required for female applicants only.',
      required: false,
      conditionalRequired: 'female',
      phase: 2,
      reference: 'Within 3 years, females only',
      instructions: [
        'Schedule through medical if not current',
        'Results must be within 3 years',
        'Include results with medical documentation'
      ]
    },
    {
      id: 19,
      category: 'Medical',
      name: 'Surgical Documentation',
      description: 'Pre/post-operative paperwork for any surgeries. Include if applicable.',
      required: false,
      phase: 2,
      reference: 'If applicable',
      instructions: [
        'Gather records for all surgeries',
        'Include pre-op and post-op records',
        'Include return to full duty documentation'
      ],
      tips: [
        'Recent surgeries may require waiting period',
        'Must demonstrate full recovery'
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
      targetBoard: applicantInfo.targetBoard || '',
      targetMOS: applicantInfo.targetMOS || '',
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
