/* Workplace Safety Compliance Training - SCORM 2004 Course Application */

(function() {
  'use strict';

  const COURSE_ID = 'workplace-safety-2026';
  const VERSION = '1.0.0';

  const state = {
    currentSection: 0,
    currentLesson: 0,
    completedLessons: new Set(),
    scores: {},
    quizAttempts: {},
    maxAttempts: 3,
    startTime: Date.now(),
    lessonTimes: {},
    draggedItem: null
  };

  const sections = [
    {
      id: 'intro',
      title: 'Introduction',
      icon: '🏠',
      lessons: [
        {
          id: 'welcome',
          title: 'Welcome',
          type: 'content',
          duration: '2 min',
          content: () => `
            <div class="cover-section">
              <h1>Workplace Safety</h1>
              <p class="subtitle">Compliance Training 2026</p>
              <p style="margin-top: 16px; opacity: 0.9; position: relative; z-index: 1;">Comprehensive safety training covering OSHA fundamentals, hazard identification, PPE, emergency procedures, ergonomics, and incident reporting.</p>
              <div style="margin-top: 24px; padding: 12px; background: rgba(255,255,255,0.15); border-radius: 8px; position: relative; z-index: 1;">
                <strong>Duration:</strong> ~50 minutes<br>
                <strong>Assessment:</strong> 20-question final exam (80% to pass)<br>
                <strong>Certificate:</strong> Upon successful completion
              </div>
            </div>
            <div class="section-cards">
              <h3 style="margin-bottom: 16px; color: #1a237e; font-size: 20px; font-weight: 700;">Course Sections</h3>
              <div class="section-cards-grid">
                <div class="section-card" onclick="navigateTo(1,0)" style="cursor:pointer;">
                  <div class="section-card-icon" style="background: #e8eaf6;">📋</div>
                  <div class="section-card-title">OSHA Fundamentals</div>
                  <div class="section-card-desc">Rights, responsibilities, and regulations</div>
                  <div class="section-card-meta">4 lessons · 10 min</div>
                </div>
                <div class="section-card" onclick="navigateTo(2,0)" style="cursor:pointer;">
                  <div class="section-card-icon" style="background: #fff3e0;">⚠️</div>
                  <div class="section-card-title">Hazard Identification</div>
                  <div class="section-card-desc">Chemical, physical, and ergonomic hazards</div>
                  <div class="section-card-meta">4 lessons · 12 min</div>
                </div>
                <div class="section-card" onclick="navigateTo(3,0)" style="cursor:pointer;">
                  <div class="section-card-icon" style="background: #e8f5e9;">🦺</div>
                  <div class="section-card-title">Personal Protective Equipment</div>
                  <div class="section-card-desc">Selection, use, and maintenance</div>
                  <div class="section-card-meta">2 lessons · 5 min</div>
                </div>
                <div class="section-card" onclick="navigateTo(4,0)" style="cursor:pointer;">
                  <div class="section-card-icon" style="background: #ffebee;">🚨</div>
                  <div class="section-card-title">Emergency Procedures</div>
                  <div class="section-card-desc">Fire, spills, and medical response</div>
                  <div class="section-card-meta">4 lessons · 10 min</div>
                </div>
                <div class="section-card" onclick="navigateTo(5,0)" style="cursor:pointer;">
                  <div class="section-card-icon" style="background: #e0f7fa;">🪑</div>
                  <div class="section-card-title">Ergonomics</div>
                  <div class="section-card-desc">Workstation setup and stretching</div>
                  <div class="section-card-meta">2 lessons · 5 min</div>
                </div>
                <div class="section-card" onclick="navigateTo(6,0)" style="cursor:pointer;">
                  <div class="section-card-icon" style="background: #f3e5f5;">📝</div>
                  <div class="section-card-title">Incident Reporting</div>
                  <div class="section-card-desc">Documentation and procedures</div>
                  <div class="section-card-meta">2 lessons · 4 min</div>
                </div>
              </div>
            </div>
          `
        },
        {
          id: 'objectives',
          title: 'Learning Objectives',
          type: 'content',
          duration: '3 min',
          content: () => `
            <h2>What You'll Learn</h2>
            <p>By the end of this course, you will be able to:</p>
            <div class="info-box">
              <div class="info-box-title">Course Objectives</div>
              <ul style="margin: 12px 0; padding-left: 20px;">
                <li>Explain OSHA rights and employer responsibilities</li>
                <li>Identify common workplace hazards (chemical, physical, ergonomic)</li>
                <li>Select and properly use appropriate PPE</li>
                <li>Follow emergency procedures for fire, spills, and medical incidents</li>
                <li>Apply ergonomic principles to workstation setup</li>
                <li>Report workplace incidents and near-misses correctly</li>
              </ul>
            </div>
            <h3>Course Sections</h3>
            <div class="two-column" style="margin-top: 16px;">
              <div class="info-box">
                <strong>Part 1:</strong> OSHA Fundamentals<br>
                <strong>Part 2:</strong> Hazard Identification<br>
                <strong>Part 3:</strong> Personal Protective Equipment
              </div>
              <div class="info-box">
                <strong>Part 4:</strong> Emergency Procedures<br>
                <strong>Part 5:</strong> Ergonomics<br>
                <strong>Part 6:</strong> Incident Reporting
              </div>
            </div>
          `
        }
      ]
    },
    {
      id: 'osha',
      title: 'OSHA Fundamentals',
      icon: '📋',
      lessons: [
        {
          id: 'osha-overview',
          title: 'What is OSHA?',
          type: 'content',
          duration: '3 min',
          content: () => `
            <h2>The Occupational Safety and Health Administration</h2>
            <p>OSHA is a federal agency established in 1970 under the Occupational Safety and Health Act. Its mission is to ensure safe and healthful working conditions for all workers.</p>
            <h3>Key Facts About OSHA</h3>
            <div class="info-box">
              <div class="info-box-title">OSHA by the Numbers</div>
              <ul style="margin: 12px 0; padding-left: 20px;">
                <li><strong>1970:</strong> OSHA established by Congress</li>
                <li><strong>262:</strong> Federal and state OSHA offices nationwide</li>
                <li><strong>100+ million:</strong> Workers protected by OSHA</li>
                <li><strong>32:</strong> States with their own OSHA-approved plans</li>
                <li><strong>$15,625:</strong> Maximum fine per serious violation (2024)</li>
              </ul>
            </div>

            <!-- Data Chart: Workplace Injury Statistics -->
            <div class="data-chart">
              <h4>Workplace Injuries &amp; Illnesses by Industry (2022)</h4>
              <div class="bar-chart">
                <div class="bar-group">
                  <div class="bar-label">Healthcare</div>
                  <div class="bar-track"><div class="bar-fill spanish" style="width: 85%"><span class="bar-value">545,100</span></div></div>
                </div>
                <div class="bar-group">
                  <div class="bar-label">Manufacturing</div>
                  <div class="bar-track"><div class="bar-fill english" style="width: 72%"><span class="bar-value">373,300</span></div></div>
                </div>
                <div class="bar-group">
                  <div class="bar-label">Construction</div>
                  <div class="bar-track"><div class="bar-fill french" style="width: 58%"><span class="bar-value">248,200</span></div></div>
                </div>
                <div class="bar-group">
                  <div class="bar-label">Transportation</div>
                  <div class="bar-track"><div class="bar-fill german" style="width: 45%"><span class="bar-value">189,500</span></div></div>
                </div>
                <div class="bar-group">
                  <div class="bar-label">Retail Trade</div>
                  <div class="bar-track"><div class="bar-fill other" style="width: 38%"><span class="bar-value">156,800</span></div></div>
                </div>
              </div>
              <div class="chart-legend">
                <div class="legend-item"><div class="legend-dot" style="background: linear-gradient(90deg, #1a237e, #3f51b5)"></div>Healthcare</div>
                <div class="legend-item"><div class="legend-dot" style="background: linear-gradient(90deg, #0d47a1, #2196f3)"></div>Manufacturing</div>
                <div class="legend-item"><div class="legend-dot" style="background: linear-gradient(90deg, #004d40, #009688)"></div>Construction</div>
                <div class="legend-item"><div class="legend-dot" style="background: linear-gradient(90deg, #e65100, #ff9800)"></div>Transportation</div>
                <div class="legend-item"><div class="legend-dot" style="background: linear-gradient(90deg, #4a148c, #9c27b0)"></div>Retail Trade</div>
              </div>
            </div>

            <div class="content-divider"><span class="divider-icon">⚖️</span></div>

            <h3>OSHA Standards</h3>
            <div class="accordion-container" role="region" aria-label="OSHA Standards categories">
              <div class="accordion-item">
                <div class="accordion-header" role="button" aria-expanded="false">
                  <span>General Duty Clause</span>
                  <span class="accordion-icon">▼</span>
                </div>
                <div class="accordion-body" role="region">
                  <p>Section 5(a)(1) of the OSH Act requires employers to provide a workplace "free from recognized hazards that are causing or are likely to cause death or serious physical harm." This broad clause covers hazards not addressed by specific standards.</p>
                </div>
              </div>
              <div class="accordion-item">
                <div class="accordion-header" role="button" aria-expanded="false">
                  <span>Industry-Specific Standards</span>
                  <span class="accordion-icon">▼</span>
                </div>
                <div class="accordion-body" role="region">
                  <p>OSHA maintains specific standards for high-risk industries:</p>
                  <ul style="padding-left: 20px; margin: 8px 0;">
                    <li><strong>Construction (29 CFR 1926):</strong> Fall protection, scaffolding, excavation</li>
                    <li><strong>Maritime (29 CFR 1915-1919):</strong> Shipyard employment, longshoring</li>
                    <li><strong>Agriculture (29 CFR 1928):</strong> Field sanitation, tractors, hazardous chemicals</li>
                  </ul>
                </div>
              </div>
              <div class="accordion-item">
                <div class="accordion-header" role="button" aria-expanded="false">
                  <span>Hazard-Specific Standards</span>
                  <span class="accordion-icon">▼</span>
                </div>
                <div class="accordion-body" role="region">
                  <p>These standards address specific hazard types across all industries:</p>
                  <ul style="padding-left: 20px; margin: 8px 0;">
                    <li><strong>Chemical Exposure:</strong> Permissible Exposure Limits (PELs), Hazard Communication</li>
                    <li><strong>Noise:</strong> 85 dB action level, hearing conservation programs</li>
                    <li><strong>Fall Protection:</strong> 6-foot trigger height, guardrails, safety nets</li>
                    <li><strong>Machine Guarding:</strong> Point-of-operation safeguards</li>
                  </ul>
                </div>
              </div>
            </div>
          `
        },
        {
          id: 'employer-responsibilities',
          title: 'Employer Responsibilities',
          type: 'content',
          duration: '3 min',
          content: () => `
            <h2>Your Employer's Obligations</h2>
            <p>Under OSHA, employers have specific legal duties to protect workers:</p>
            <div class="info-box">
              <div class="info-box-title">Employer Must Provide</div>
              <ul style="margin: 12px 0; padding-left: 20px;">
                <li>A workplace free from recognized hazards</li>
                <li>Safety training in a language workers understand</li>
                <li>Proper personal protective equipment (PPE) at no cost</li>
                <li>Access to safety data sheets (SDS) for all chemicals</li>
                <li>Emergency action plans and evacuation procedures</li>
                <li>Regular safety inspections and hazard assessments</li>
              </ul>
            </div>
            <div class="warning-box">
              <div class="warning-title">Serious Violations</div>
              <p>Falls, struck-by incidents, caught-in/between, and electrocution are OSHA's "Fatal Four" — the leading causes of construction worker deaths.</p>
            </div>
            <h3>Recordkeeping Requirements</h3>
            <p>Employers must:</p>
            <ul style="padding-left: 20px; margin: 12px 0;">
              <li>Maintain OSHA 300 injury and illness logs</li>
              <li>Post OSHA 300A summary annually (Feb 1 - Apr 30)</li>
              <li>Report fatalities within 8 hours and hospitalizations within 24 hours</li>
            </ul>
          `
        },
        {
          id: 'worker-rights',
          title: 'Your Rights as a Worker',
          type: 'content',
          duration: '2 min',
          content: () => `
            <h2>You Have the Right To:</h2>
            <div class="info-box">
              <div class="info-box-title">Worker Rights Under OSHA</div>
              <ol style="margin: 12px 0; padding-left: 20px;">
                <li><strong>Safe Workplace:</strong> Work in an environment free from recognized hazards</li>
                <li><strong>Training:</strong> Receive safety training in a language you understand</li>
                <li><strong>Information:</strong> Access to injury/illness data and chemical SDS</li>
                <li><strong>PPE:</strong> Employer-provided PPE at no cost to you</li>
                <li><strong>Report:</strong> Report hazards without fear of retaliation</li>
                <li><strong>Refuse:</strong> Refuse unsafe work without retaliation</li>
                <li><strong>File Complaint:</strong> File a confidential OSHA complaint</li>
              </ol>
            </div>
            <div class="statement-block" id="rights-statement">
              <div class="statement-text">Under OSHA, you have the right to refuse work that you believe is immediately dangerous to your life or health.</div>
              <div class="statement-buttons">
                <button class="statement-btn agree" onclick="checkStatement('rights-statement', true, true, '✓ Correct! You have the right to refuse dangerous work under OSHA protections.', '✗ Actually, under OSHA you DO have the right to refuse work that poses imminent danger of death or serious injury.')">Agree</button>
                <button class="statement-btn disagree" onclick="checkStatement('rights-statement', true, false, '✓ Correct! You have the right to refuse dangerous work under OSHA protections.', '✗ Actually, under OSHA you DO have the right to refuse work that poses imminent danger of death or serious injury.')">Disagree</button>
              </div>
              <div class="statement-feedback" id="rights-statement-feedback"></div>
            </div>
            <div class="info-box">
              <div class="info-box-title">Anti-Retaliation Protections</div>
              <p>OSHA prohibits employers from retaliating against workers for exercising their rights. Retaliation includes:</p>
              <ul style="margin: 8px 0; padding-left: 20px;">
                <li>Firing or demoting</li>
                <li>Threatening or intimidating</li>
                <li>Reducing hours or pay</li>
                <li>Transferring to undesirable position</li>
              </ul>
            </div>
          `
        },
        {
          id: 'osha-confidence-check',
          title: 'Confidence Check',
          type: 'confidence',
          duration: '1 min',
          question: 'How confident are you in your understanding of OSHA regulations and employer obligations?',
          answer: 'OSHA regulations cover employer responsibilities like providing training, PPE, and maintaining records. Workers have the right to report hazards without retaliation.',
          answerIsCorrect: true,
          feedback: 'OSHA regulations cover employer responsibilities like providing training, PPE, and maintaining records. Workers have the right to report hazards without retaliation. If you scored below 3, review the previous lessons before proceeding.'
        },
        {
          id: 'osha-knowledge-check',
          title: 'Knowledge Check',
          type: 'quiz',
          duration: '2 min',
          questions: [
            {
              question: 'What year was OSHA established?',
              options: ['1960', '1965', '1970', '1975'],
              correct: 2,
              explanation: 'OSHA was established in 1970 under the Occupational Safety and Health Act signed by President Nixon.',
              optionFeedback: [
                'No — OSHA was created a decade later.',
                'No — Still five years too early.',
                '✓ Correct! OSHA was signed into law on December 29, 1970.',
                'No — That\'s five years after OSHA was established.'
              ]
            },
            {
              question: 'Which of the following is NOT an employer responsibility?',
              options: [
                'Provide safety training',
                'Pay for employee PPE',
                'File workers compensation claims',
                'Keep injury records'
              ],
              correct: 2,
              explanation: 'Filing workers compensation claims is typically the employee\'s responsibility, though employers must report workplace injuries.',
              optionFeedback: [
                'This IS an employer responsibility — employers must train workers on hazards.',
                'This IS an employer responsibility — PPE must be provided at no cost.',
                '✓ Correct — filing claims is the employee\'s responsibility, not the employer\'s.',
                'This IS an employer responsibility — OSHA requires recordkeeping (OSHA 300 log).'
              ]
            },
            {
              question: 'Can an employer retaliate against a worker for reporting a safety hazard?',
              type: 'true-false',
              correct: false,
              explanation: 'OSHA prohibits retaliation against workers for exercising their safety rights, regardless of employment status.'
            },
            {
              question: 'Employers must report workplace fatalities to OSHA within how many hours?',
              type: 'fill-blank',
              answer: '8',
              hint: 'A single digit number',
              explanation: 'OSHA requires employers to report fatalities within 8 hours of the incident.'
            }
          ]
        }
      ]
    },
    {
      id: 'hazards',
      title: 'Hazard Identification',
      icon: '⚠️',
      lessons: [
        {
          id: 'hazard-overview',
          title: 'Types of Workplace Hazards',
          type: 'content',
          duration: '3 min',
          content: () => `
            <h2>Recognizing Workplace Hazards</h2>
            <p>A hazard is any source of potential harm. Understanding hazard types is the first step in prevention.</p>
            <h3>Chemical Hazards</h3>
            <div class="info-box">
              <div class="info-box-title">Chemical Hazards</div>
              <ul style="margin: 12px 0; padding-left: 20px;">
                <li><strong>Corrosives:</strong> Acids, alkalis that burn skin/eyes</li>
                <li><strong>Flammables:</strong> Solvents, gases that ignite easily</li>
                <li><strong>Toxic:</strong> Lead, asbestos, silica dust</li>
                <li><strong>Irritants:</strong> Cleaning agents, solvents</li>
              </ul>
              <p><strong>Protection:</strong> Read SDS, use PPE, ensure ventilation, proper storage</p>
            </div>
            <h3>Physical Hazards</h3>
            <div class="info-box">
              <div class="info-box-title">Physical Hazards</div>
              <ul style="margin: 12px 0; padding-left: 20px;">
                <li><strong>Noise:</strong> >85 dB sustained (machinery, power tools)</li>
                <li><strong>Vibration:</strong> Hand-arm (tools) or whole-body (vehicles)</li>
                <li><strong>Radiation:</strong> X-rays, UV, radiofrequency</li>
                <li><strong>Temperature:</strong> Extreme heat or cold exposure</li>
              </ul>
              <p><strong>Protection:</strong> PPE, engineering controls, work scheduling</p>
            </div>
          `
        },
        {
          id: 'ergonomic-hazards',
          title: 'Ergonomic Hazards',
          type: 'content',
          duration: '3 min',
          content: () => `
            <h2>Ergonomic Hazards</h2>
            <p>Conditions that force the body into unnatural positions or repetitive motions.</p>
            <div class="info-box">
              <div class="info-box-title">Common Ergonomic Hazards</div>
              <ul style="margin: 12px 0; padding-left: 20px;">
                <li><strong>Repetitive Motion:</strong> Typing, assembly line work, scanning</li>
                <li><strong>Awkward Postures:</strong> Bending, reaching overhead, twisting</li>
                <li><strong>Forceful Exertion:</strong> Lifting heavy objects, pushing/pulling</li>
                <li><strong>Contact Stress:</strong> Resting wrists on hard edges</li>
                <li><strong>Prolonged Standing/Sitting:</strong> Without breaks</li>
              </ul>
            </div>
            <h3>Resulting Injuries</h3>
            <ul style="padding-left: 20px; margin: 12px 0;">
              <li>Carpal Tunnel Syndrome</li>
              <li>Tendinitis</li>
              <li>Back injuries (herniated discs)</li>
              <li>Rotator cuff injuries</li>
              <li>Trigger finger</li>
            </ul>
            <div class="warning-box">
              <div class="warning-title">Warning Signs</div>
              <p>Numbness, tingling, pain, swelling, or reduced range of motion may indicate an ergonomic injury. Report these symptoms immediately.</p>
            </div>
          `
        },
        {
          id: 'hazard-sorting',
          title: 'Hazard Classification Activity',
          type: 'drag-drop',
          duration: '3 min',
          items: [
            { id: 'h1', text: 'Benzene exposure', correct: 'chemical' },
            { id: 'h2', text: 'Noise from machinery', correct: 'physical' },
            { id: 'h3', text: 'Repetitive typing', correct: 'ergonomic' },
            { id: 'h4', text: 'Sulfuric acid spill', correct: 'chemical' },
            { id: 'h5', text: 'Falling objects', correct: 'physical' },
            { id: 'h6', text: 'Heavy lifting', correct: 'ergonomic' },
            { id: 'h7', text: 'Welding arc flash', correct: 'physical' },
            { id: 'h8', text: 'Cleaning solvents', correct: 'chemical' },
            { id: 'h9', text: 'Prolonged standing', correct: 'ergonomic' }
          ],
          zones: [
            { id: 'chemical', label: 'Chemical Hazard' },
            { id: 'physical', label: 'Physical Hazard' },
            { id: 'ergonomic', label: 'Ergonomic Hazard' }
          ]
        },
        {
          id: 'hazard-sorting-order',
          title: 'Risk Assessment Priority',
          type: 'sorting',
          duration: '2 min',
          instruction: 'Drag the hazard assessment steps into the correct order (most critical first):',
          items: [
            { id: 's1', text: 'Identify all hazards in the work area', correct: 0 },
            { id: 's2', text: 'Assess the severity and likelihood of each hazard', correct: 1 },
            { id: 's3', text: 'Implement control measures (hierarchy of controls)', correct: 2 },
            { id: 's4', text: 'Monitor effectiveness of controls', correct: 3 },
            { id: 's5', text: 'Document findings and update assessment regularly', correct: 4 }
          ]
        },
        {
          id: 'hazards-knowledge-check',
          title: 'Knowledge Check',
          type: 'quiz',
          duration: '2 min',
          questions: [
            {
              question: 'Which type of hazard involves harmful substances that can be inhaled, absorbed, or ingested?',
              options: ['Physical hazard', 'Chemical hazard', 'Ergonomic hazard', 'Biological hazard'],
              correct: 1,
              feedback: ['Physical hazards involve energy sources like noise, radiation, or temperature extremes.', 'Correct! Chemical hazards include substances that can cause harm through exposure — corrosives, flammables, toxins, and irritants.', 'Ergonomic hazards relate to workplace conditions that strain the body — repetitive motion, awkward postures, heavy lifting.', 'Biological hazards come from living organisms — bacteria, viruses, fungi, and other pathogens.']
            },
            {
              question: 'What is the PRIMARY purpose of the hierarchy of controls?',
              options: ['To identify new hazards', 'To prioritize the most effective hazard elimination methods', 'To train employees on PPE use', 'To document workplace incidents'],
              correct: 1,
              feedback: ['The hierarchy of controls is not primarily about identification — it is about prioritizing solutions after hazards are known.', 'Correct! The hierarchy prioritizes elimination and substitution first, then engineering controls, administrative controls, and PPE as the last resort.', 'PPE is actually the last level of the hierarchy, not the primary purpose.', 'Documentation is important but is not the purpose of the hierarchy of controls.']
            },
            {
              question: 'Which of the following is an example of an engineering control?',
              options: ['Wearing a respirator', 'Installing a ventilation system', 'Posting safety signs', 'Rotating workers every 2 hours'],
              correct: 1,
              feedback: ['Wearing a respirator is PPE — the last line of defense in the hierarchy.', 'Correct! Engineering controls physically change the work environment — ventilation systems remove contaminants at the source.', 'Posting safety signs is an administrative control that changes how people work.', 'Rotating workers is an administrative control that reduces individual exposure time.']
            }
          ]
        }
      ]
    },
    {
      id: 'ppe',
      title: 'Personal Protective Equipment',
      icon: '🦺',
      lessons: [
        {
          id: 'ppe-overview',
          title: 'PPE Selection Guide',
          type: 'content',
          duration: '3 min',
          content: () => `
            <h2>Choosing the Right PPE</h2>
            <p>PPE is the last line of defense. Always prioritize elimination, engineering, and administrative controls first.</p>
            <h3>PPE Hierarchy</h3>
            <div class="info-box">
              <div class="info-box-title">Controls Hierarchy (Most to Least Effective)</div>
              <ol style="margin: 12px 0; padding-left: 20px;">
                <li><strong>Elimination:</strong> Remove the hazard entirely</li>
                <li><strong>Substitution:</strong> Replace with less hazardous material</li>
                <li><strong>Engineering Controls:</strong> Ventilation, machine guards</li>
                <li><strong>Administrative Controls:</strong> Training, scheduling, signs</li>
                <li><strong>PPE:</strong> Last resort — protect the worker</li>
              </ol>
            </div>
            <div class="statement-block" id="ppe-hierarchy-statement">
              <div class="statement-text">PPE is the most important safety measure in the workplace.</div>
              <div class="statement-buttons">
                <button class="statement-btn agree" onclick="checkStatement('ppe-hierarchy-statement', true, false, '✗ Not quite. PPE is actually the LAST line of defense. Always prioritize elimination, engineering, and administrative controls first.', '✓ Correct! PPE is the last line of defense, not the most important.')">Agree</button>
                <button class="statement-btn disagree" onclick="checkStatement('ppe-hierarchy-statement', true, true, '✓ Correct! PPE is actually the LAST line of defense. Always prioritize elimination, engineering, and administrative controls first.', '✗ Not quite. PPE is the last line of defense, not the most important.')">Disagree</button>
              </div>
              <div class="statement-feedback" id="ppe-hierarchy-statement-feedback"></div>
            </div>
            <div class="content-divider"><span class="divider-icon">📸</span></div>
            <h3>PPE Equipment Gallery</h3>
            <p>Browse common PPE items and their applications:</p>
            <div class="image-gallery">
              <div class="gallery-item">
                <div style="width:100%;height:160px;background:linear-gradient(135deg,#1a237e,#3949ab);border-radius:8px 8px 0 0;display:flex;align-items:center;justify-content:center;">
                  <span style="font-size:64px;">👷</span>
                </div>
                <div class="gallery-caption"><strong>Hard Hat</strong><br>Protects against falling objects and electrical contact</div>
              </div>
              <div class="gallery-item">
                <div style="width:100%;height:160px;background:linear-gradient(135deg,#1565c0,#42a5f5);border-radius:8px 8px 0 0;display:flex;align-items:center;justify-content:center;">
                  <span style="font-size:64px;">🥽</span>
                </div>
                <div class="gallery-caption"><strong>Safety Goggles</strong><br>Shields eyes from splashes, dust, and debris</div>
              </div>
              <div class="gallery-item">
                <div style="width:100%;height:160px;background:linear-gradient(135deg,#2e7d32,#66bb6a);border-radius:8px 8px 0 0;display:flex;align-items:center;justify-content:center;">
                  <span style="font-size:64px;">🧤</span>
                </div>
                <div class="gallery-caption"><strong>Protective Gloves</strong><br>Various types for chemical, cut, and heat hazards</div>
              </div>
              <div class="gallery-item">
                <div style="width:100%;height:160px;background:linear-gradient(135deg,#e65100,#ff9800);border-radius:8px 8px 0 0;display:flex;align-items:center;justify-content:center;">
                  <span style="font-size:64px;">🥾</span>
                </div>
                <div class="gallery-caption"><strong>Steel-Toe Boots</strong><br>Protects feet from crushing and puncture hazards</div>
              </div>
              <div class="gallery-item">
                <div style="width:100%;height:160px;background:linear-gradient(135deg,#f9a825,#fdd835);border-radius:8px 8px 0 0;display:flex;align-items:center;justify-content:center;">
                  <span style="font-size:64px;">🦺</span>
                </div>
                <div class="gallery-caption"><strong>High-Vis Vest</strong><br>Ensures visibility in low-light and traffic areas</div>
              </div>
              <div class="gallery-item">
                <div style="width:100%;height:160px;background:linear-gradient(135deg,#4a148c,#ab47bc);border-radius:8px 8px 0 0;display:flex;align-items:center;justify-content:center;">
                  <span style="font-size:64px;">😷</span>
                </div>
                <div class="gallery-caption"><strong>Respirator</strong><br>N95 and full-face protection from airborne hazards</div>
              </div>
            </div>
            <h3>PPE Identification — Interactive Hotspots</h3>
            <p>Click each hotspot to learn about different PPE types:</p>
            <div class="labeled-graphic">
              <div class="lg-placeholder">
                <div style="position: relative; width: 100%; max-width: 600px; margin: 0 auto;">
                  <div style="background: #1a2332; border-radius: 12px; padding: 40px; text-align: center; min-height: 300px; display: flex; align-items: center; justify-content: center;">
                    <div style="color: #8892a4; font-size: 14px;">
                      <div style="font-size: 48px; margin-bottom: 16px;">🦺👷🥽🧤🥾</div>
                      <p>PPE Equipment Display</p>
                    </div>
                  </div>
                  <div class="hotspot" style="position: absolute; top: 40%; left: 45%;" aria-label="Hard Hat hotspot" aria-expanded="false">
                    <div class="hotspot-dot">1</div>
                    <div class="hotspot-tooltip" style="display:none;">
                      <strong>Hard Hat</strong><br>Protects against falling objects, electrical hazards. Must meet ANSI Z89.1 standards. Inspect daily for cracks.
                    </div>
                  </div>
                  <div class="hotspot" style="position: absolute; top: 40%; left: 54%;" aria-label="Safety Glasses hotspot" aria-expanded="false">
                    <div class="hotspot-dot">2</div>
                    <div class="hotspot-tooltip" style="display:none;">
                      <strong>Safety Glasses</strong><br>Protect eyes from flying debris, chemical splashes. Must meet ANSI Z87.1. Side shields required.
                    </div>
                  </div>
                  <div class="hotspot" style="position: absolute; top: 40%; left: 62%;" aria-label="Gloves hotspot" aria-expanded="false">
                    <div class="hotspot-dot">3</div>
                    <div class="hotspot-tooltip" style="display:none;">
                      <strong>Gloves</strong><br>Protect hands from cuts, chemicals, burns. Match glove type to hazard. Inspect for tears before each use.
                    </div>
                  </div>
                  <div class="hotspot" style="position: absolute; top: 40%; left: 70%;" aria-label="Safety Boots hotspot" aria-expanded="false">
                    <div class="hotspot-dot">4</div>
                    <div class="hotspot-tooltip" style="display:none;">
                      <strong>Safety Boots</strong><br>Steel-toe boots protect from crushing. Slip-resistant soles prevent falls. Must meet ASTM F2413.
                    </div>
                  </div>
                  <div class="hotspot" style="position: absolute; top: 40%; left: 37%;" aria-label="High-Vis Vest hotspot" aria-expanded="false">
                    <div class="hotspot-dot">5</div>
                    <div class="hotspot-tooltip" style="display:none;">
                      <strong>High-Visibility Vest</strong><br>Makes workers visible to vehicle operators. Required in construction zones. ANSI/ISEA 107 Class 2 minimum.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="content-divider"><span class="divider-icon">🦺</span></div>

            <h3>PPE Quick Reference Flashcards</h3>
            <p>Click each card to reveal the answer:</p>
            <div class="flashcard-container">
              <div class="flashcard active">
                <div class="flashcard-face">
                  <div class="flashcard-front">
                    <div class="flashcard-label">Hard Hat</div>
                    <p>What is the ANSI standard for hard hats?</p>
                  </div>
                  <div class="flashcard-back">
                    <div class="flashcard-label">Answer</div>
                    <p><strong>ANSI Z89.1</strong> — Must be inspected daily, replaced after any impact.</p>
                  </div>
                </div>
              </div>
              <div class="flashcard">
                <div class="flashcard-face">
                  <div class="flashcard-front">
                    <div class="flashcard-label">Safety Glasses</div>
                    <p>What standard applies to eye protection?</p>
                  </div>
                  <div class="flashcard-back">
                    <div class="flashcard-label">Answer</div>
                    <p><strong>ANSI Z87.1</strong> — Side shields required. Must fit snugly.</p>
                  </div>
                </div>
              </div>
              <div class="flashcard">
                <div class="flashcard-face">
                  <div class="flashcard-front">
                    <div class="flashcard-label">Safety Boots</div>
                    <p>What standard applies to protective footwear?</p>
                  </div>
                  <div class="flashcard-back">
                    <div class="flashcard-label">Answer</div>
                    <p><strong>ASTM F2413</strong> — Steel/composite toe, puncture-resistant sole.</p>
                  </div>
                </div>
              </div>
              <div class="flashcard-controls">
                <button class="flashcard-btn" data-action="prev">← Previous</button>
                <span class="flashcard-progress">1 / 3</span>
                <button class="flashcard-btn" data-action="next">Next →</button>
              </div>
            </div>

            <div class="content-divider"><span class="divider-icon">📋</span></div>

            <h3>PPE by Hazard Type</h3>
            <div class="two-column" style="margin-top: 16px;">
              <div class="info-box">
                <strong>Eye/Face Protection:</strong><br>
                Safety glasses, goggles, face shields, welding helmets
              </div>
              <div class="info-box">
                <strong>Hearing Protection:</strong><br>
                Earplugs (foam, pre-molded), earmuffs, canal caps
              </div>
              <div class="info-box">
                <strong>Hand Protection:</strong><br>
                Leather, chemical-resistant, cut-resistant, heat-resistant gloves
              </div>
              <div class="info-box">
                <strong>Respiratory Protection:</strong><br>
                N95, half-face respirators, full-face, SCBA
              </div>
            </div>
          `
        },
        {
          id: 'ppe-donning',
          title: 'Donning & Doffing PPE',
          type: 'content',
          duration: '2 min',
          content: () => `
            <h2>Proper PPE Sequence</h2>
            <h3>Donning (Putting On)</h3>
            <div class="info-box">
              <div class="info-box-title">Donning Order</div>
              <ol style="margin: 12px 0; padding-left: 20px;">
                <li>Perform hand hygiene</li>
                <li>Put on gown/coveralls</li>
                <li>Put on mask/respirator (ensure seal)</li>
                <li>Put on goggles/face shield</li>
                <li>Put on gloves (over gown cuffs)</li>
              </ol>
            </div>
            <h3>Doffing (Removing)</h3>
            <div class="warning-box">
              <div class="warning-title">Doffing Order (Remove Contaminants Safely)</div>
              <ol style="margin: 12px 0; padding-left: 20px;">
                <li>Remove gloves (turn inside out)</li>
                <li>Perform hand hygiene</li>
                <li>Remove goggles/face shield</li>
                <li>Remove gown (turn inside out)</li>
                <li>Remove mask/respirator</li>
                <li>Perform hand hygiene</li>
              </ol>
              <p><strong>Critical:</strong> Always remove contaminated items by working from most contaminated (outer) to least contaminated (closest to skin).</p>
            </div>
          `
        }
      ]
    },
    {
      id: 'emergency',
      title: 'Emergency Procedures',
      icon: '🚨',
      lessons: [
        {
          id: 'fire-emergency',
          title: 'Fire Emergency',
          type: 'content',
          duration: '3 min',
          content: () => `
            <h2>Fire Response: R.A.C.E.</h2>
            <div class="tabs-block">
              <div class="tabs-nav" id="fire-tabs-nav">
                <button class="tab-btn active" onclick="switchTab('fire-tabs', 0)">R.A.C.E. Protocol</button>
                <button class="tab-btn" onclick="switchTab('fire-tabs', 1)">P.A.S.S. Technique</button>
                <button class="tab-btn" onclick="switchTab('fire-tabs', 2)">When NOT to Fight</button>
              </div>
              <div class="tab-panel active" id="fire-tabs-0">
                <div class="callout info">
                  <div class="callout-icon">🚨</div>
                  <div class="callout-body">
                    <div class="callout-title">R.A.C.E. Protocol</div>
                    <p>Follow these four steps when you discover a fire:</p>
                    <ol style="margin: 8px 0; padding-left: 20px;">
                      <li><strong>R - Rescue:</strong> Alert anyone in immediate danger</li>
                      <li><strong>A - Alarm:</strong> Activate fire alarm, call 911</li>
                      <li><strong>C - Contain:</strong> Close doors to confine fire</li>
                      <li><strong>E - Evacuate/Extinguish:</strong> Evacuate or use extinguisher if safe</li>
                    </ol>
                  </div>
                </div>
              </div>
              <div class="tab-panel" id="fire-tabs-1">
                <div class="callout warning">
                  <div class="callout-icon">🔥</div>
                  <div class="callout-body">
                    <div class="callout-title">P.A.S.S. Technique</div>
                    <p>Always follow this sequence when using a fire extinguisher:</p>
                    <ol style="margin: 8px 0; padding-left: 20px;">
                      <li><strong>P - Pull:</strong> Pull the safety pin</li>
                      <li><strong>A - Aim:</strong> Aim at the base of the fire</li>
                      <li><strong>S - Squeeze:</strong> Squeeze the handle</li>
                      <li><strong>S - Sweep:</strong> Sweep from side to side</li>
                    </ol>
                  </div>
                </div>
              </div>
              <div class="tab-panel" id="fire-tabs-2">
                <div class="callout danger">
                  <div class="callout-icon">⚠️</div>
                  <div class="callout-body">
                    <div class="callout-title">When NOT to Fight Fire</div>
                    <p>Evacuate immediately if: fire is spreading rapidly, smoke is heavy, you're alone, or the extinguisher is empty. Never fight a fire if it blocks your escape route.</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="content-divider"><span class="divider-icon">🔥</span></div>
            <div class="statement-block" id="fire-statement">
              <div class="statement-text">You should always attempt to fight a fire before evacuating.</div>
              <div class="statement-buttons">
                <button class="statement-btn agree" onclick="checkStatement('fire-statement', true, false, '✗ Not quite. Never fight a fire if it blocks your escape route, is spreading rapidly, or you are alone.', '✓ Correct! Always evacuate first unless the fire is small, contained, and you have a clear escape route.')">Agree</button>
                <button class="statement-btn disagree" onclick="checkStatement('fire-statement', true, true, '✗ Not quite. Never fight a fire if it blocks your escape route, is spreading rapidly, or you are alone.', '✓ Correct! Always evacuate first unless the fire is small, contained, and you have a clear escape route.')">Disagree</button>
              </div>
              <div class="statement-feedback" id="fire-statement-feedback"></div>
            </div>
            <h3>Fire Emergency Timeline</h3>
            <div class="timeline-container" role="list" aria-label="Fire emergency response timeline">
              <div class="timeline-item" role="listitem">
                <div class="timeline-date">0-10 seconds</div>
                <div class="timeline-title">Discover the Fire</div>
                <div class="timeline-desc">Assess the situation. If safe, attempt to use extinguisher. If not, proceed to alarm.</div>
              </div>
              <div class="timeline-item" role="listitem">
                <div class="timeline-date">10-30 seconds</div>
                <div class="timeline-title">Activate Alarm & Call 911</div>
                <div class="timeline-desc">Pull the nearest fire alarm and call emergency services. State your location clearly.</div>
              </div>
              <div class="timeline-item" role="listitem">
                <div class="timeline-date">30-60 seconds</div>
                <div class="timeline-title">Begin Evacuation</div>
                <div class="timeline-desc">Close doors behind you. Use stairs, never elevators. Help others if safe to do so.</div>
              </div>
              <div class="timeline-item" role="listitem">
                <div class="timeline-date">1-5 minutes</div>
                <div class="timeline-title">Assembly Point</div>
                <div class="timeline-desc">Report to designated assembly area. Account for all personnel. Report missing persons to firefighters.</div>
              </div>
            </div>
          `
        },
        {
          id: 'spill-emergency',
          title: 'Chemical Spill Response',
          type: 'content',
          duration: '2 min',
          content: () => `
            <div class="content-divider"><span class="divider-icon">🧪</span></div>
            <h2>Chemical Spill Procedures</h2>
            <h3>Small Spill (Minor)</h3>
            <div class="info-box">
              <div class="info-box-title">Minor Spill Response</div>
              <ol style="margin: 12px 0; padding-left: 20px;">
                <li>Alert nearby workers</li>
                <li>Don appropriate PPE</li>
                <li>Contain spill with absorbent material</li>
                <li>Clean up using appropriate methods</li>
                <li>Dispose of materials in proper waste container</li>
                <li>Report to supervisor</li>
              </ol>
            </div>
            <h3>Large Spill (Major)</h3>
            <div class="warning-box">
              <div class="warning-title">Major Spill Response</div>
              <ol style="margin: 12px 0; padding-left: 20px;">
                <li>Evacuate the area immediately</li>
                <li>Alert others and activate alarm if needed</li>
                <li>Close doors to contain the spill</li>
                <li>Call emergency response team</li>
                <li>Do NOT attempt to clean up</li>
                <li>Account for all personnel at assembly point</li>
              </ol>
              <p><strong>Rule of thumb:</strong> If you can't identify the material or it's larger than 1 liter, treat it as a major spill.</p>
            </div>
            <div class="content-divider"><span class="divider-icon">⚠️</span></div>
            <div class="statement-block" id="spill-statement">
              <div class="statement-text">For any chemical spill, you should always attempt cleanup yourself.</div>
              <div class="statement-buttons">
                <button class="statement-btn agree" onclick="checkStatement('spill-statement', true, false, '✗ Incorrect. Major spills should never be cleaned up by untrained personnel — evacuate and call the emergency response team.', '✓ Correct! For major spills, evacuate immediately and leave cleanup to trained emergency response teams.')">Agree</button>
                <button class="statement-btn disagree" onclick="checkStatement('spill-statement', true, true, '✗ Incorrect. Major spills should never be cleaned up by untrained personnel — evacuate and call the emergency response team.', '✓ Correct! For major spills, evacuate immediately and leave cleanup to trained emergency response teams.')">Disagree</button>
              </div>
              <div class="statement-feedback" id="spill-statement-feedback"></div>
            </div>
          `
        },
        {
          id: 'emergency-scenario',
          title: 'Emergency Scenario Practice',
          type: 'content',
          duration: '3 min',
          content: () => `
            <h2>Emergency Response Scenario</h2>
            <p>You are working in the warehouse when you smell smoke. Make decisions to handle this emergency correctly.</p>
            <div class="scenario-container" data-scenario="${JSON.stringify({
              start: "discovery",
              nodes: {
                "discovery": {
                  text: "You smell smoke while working in the warehouse. You look around and see a small fire near a storage shelf with cardboard boxes. What do you do?",
                  choices: [
                    { text: "Try to put it out with a fire extinguisher immediately", correct: false, feedback: "Rushing to fight fire without assessing danger is risky. First, assess the situation.", next: "danger" },
                    { text: "Assess the situation — check if anyone needs rescue and evaluate fire size", correct: true, feedback: "Correct! Following R.A.C.E., start by assessing the situation.", next: "ok" },
                    { text: "Run away immediately", correct: false, feedback: "Running without alerting others or assessing puts everyone at risk. Follow R.A.C.E.", next: "alert" }
                  ]
                },
                "ok": {
                  text: "Good assessment! You see no one is in immediate danger. The fire is small and contained to one shelf. What's your next step?",
                  choices: [
                    { text: "Pull the fire alarm and call 911", correct: true, feedback: "Correct! Always activate the alarm and alert emergency services.", next: "extinguish" },
                    { text: "Start fighting the fire with an extinguisher", correct: false, feedback: "After assessing safety, the next R.A.C.E. step is to alarm/notify others first.", next: "extinguish" },
                    { text: "Go back to work since it's small", correct: false, feedback: "Even small fires can spread rapidly. Always activate the alarm.", next: "extinguish" }
                  ]
                },
                "danger": {
                  text: "You try to fight the fire but the flames are spreading rapidly. Thick smoke is filling the area. What should you do now?",
                  choices: [
                    { text: "Keep trying to fight the fire", correct: false, feedback: "Never fight a fire that's spreading rapidly with heavy smoke. This is dangerous.", next: "evacuate" },
                    { text: "Evacuate immediately via the nearest exit", correct: true, feedback: "Correct! If fire is spreading rapidly with heavy smoke, evacuate immediately. Your life comes first.", next: "evacuate" },
                    { text: "Call 911 before evacuating", correct: false, feedback: "Call 911 AFTER you're safe. Getting out takes priority when fire is spreading rapidly.", next: "evacuate" }
                  ]
                },
                "alert": {
                  text: "Wait — before fleeing, you should assess if anyone needs help. But let's say you did assess: no one is trapped, the fire is small. You've now pulled the alarm. What's next?",
                  choices: [
                    { text: "Close doors to contain the fire and begin evacuation", correct: true, feedback: "Correct! Contain by closing doors, then evacuate using stairs.", next: "done-good" },
                    { text: "Go back and fight the fire since it's small", correct: false, feedback: "After alerting, containment and evacuation take priority unless you're trained.", next: "done-ok" }
                  ]
                },
                "extinguish": {
                  text: "The alarm is activated. The fire is small (one shelf). Should you try to extinguish or evacuate?",
                  choices: [
                    { text: "Try to extinguish — it's small enough for P.A.S.S.", correct: true, feedback: "Good choice! A small, contained fire with clear escape route is appropriate for extinguisher use.", next: "done-good" },
                    { text: "Evacuate — let firefighters handle it", correct: true, feedback: "Also correct! If you're unsure, evacuation is always the safest option.", next: "done-ok" },
                    { text: "Wait for others to decide", correct: false, feedback: "In an emergency, take action. Don't wait — either fight (if safe) or evacuate.", next: "done-ok" }
                  ]
                },
                "evacuate": {
                  text: "You evacuate the building safely. You reach the assembly point. What should you do?",
                  choices: [
                    { text: "Report to supervisor and account for all personnel", correct: true, feedback: "Correct! At the assembly point, check in and report any missing colleagues.", next: "done-good" },
                    { text: "Go back inside to get your belongings", correct: false, feedback: "NEVER re-enter a burning building. Your belongings can be replaced, you cannot.", next: "done-good" }
                  ]
                },
                "done-good": {
                  text: "Excellent work! You've completed the emergency scenario by following proper R.A.C.E. procedures. Remember: Rescue → Alarm → Contain → Evacuate/Extinguish.",
                  end: true
                },
                "done-ok": {
                  text: "You made it through, but some decisions could have been better. Review the R.A.C.E. protocol and always follow the correct order: Rescue → Alarm → Contain → Evacuate/Extinguish.",
                  end: true
                }
              }
            }).replace(/"/g, '&quot;')}">
              <div class="scenario-header"><h3>Warehouse Fire Scenario</h3></div>
              <div class="scenario-body">
                <div class="scenario-narrative"></div>
                <div class="scenario-choices"></div>
                <div class="scenario-feedback"></div>
                <div class="scenario-score"></div>
              </div>
            </div>
            <h3>Process: Hazard Identification Steps</h3>
            <p>Follow these steps to identify workplace hazards:</p>
            <div class="process-steps">
              <div class="process-step">
                <div class="process-step-icon">1</div>
                <div class="process-step-title">Walk the Area</div>
                <div class="process-step-desc">Conduct a systematic walkthrough of the workspace. Observe all activities and conditions.</div>
              </div>
              <div class="process-step">
                <div class="process-step-icon">2</div>
                <div class="process-step-title">Review Records</div>
                <div class="process-step-desc">Check past incident reports, near-misses, and safety complaints for patterns.</div>
              </div>
              <div class="process-step">
                <div class="process-step-icon">3</div>
                <div class="process-step-title">Talk to Workers</div>
                <div class="process-step-desc">Ask employees about hazards they've observed. They know their tasks best.</div>
              </div>
              <div class="process-step">
                <div class="process-step-icon">4</div>
                <div class="process-step-title">Inspect Equipment</div>
                <div class="process-step-desc">Check machinery, tools, and safety devices for damage or improper guards.</div>
              </div>
              <div class="process-step">
                <div class="process-step-icon">5</div>
                <div class="process-step-title">Document & Prioritize</div>
                <div class="process-step-desc">Record all findings, rank by severity, and assign corrective actions with deadlines.</div>
              </div>
            </div>
          `
        },
        {
          id: 'emergency-quiz',
          title: 'Emergency Knowledge Check',
          type: 'quiz',
          duration: '2 min',
          questions: [
            {
              question: 'What does R.A.C.E. stand for in fire response?',
              options: [
                'Run, Alert, Call, Exit',
                'Rescue, Alarm, Contain, Evacuate/Extinguish',
                'React, Act, Control, Eliminate',
                'Respond, Alarm, Control, Escape'
              ],
              correct: 1,
              explanation: 'R.A.C.E. = Rescue anyone in danger, Alarm (call 911), Contain (close doors), Evacuate or Extinguish.',
              optionFeedback: [
                'Incorrect — "Run" is not the first step. R.A.C.E. starts with Rescue (helping those in danger).',
                '✓ Correct! Rescue → Alarm → Contain → Evacuate/Extinguish.',
                'Close but wrong — the "C" stands for Contain, not Control.',
                'Partially right on "Respond" but "Control" isn\'t the correct C. It\'s Contain.'
              ]
            },
            {
              question: 'For a fire extinguisher, you should always aim at the base of the fire.',
              type: 'true-false',
              correct: true,
              explanation: 'P.A.S.S. requires aiming at the BASE of the flames, not the top, to cut off the fuel source.'
            },
            {
              question: 'Match each fire extinguisher step with its action:',
              type: 'matching',
              options: ['Pull the pin', 'Aim at base', 'Squeeze handle', 'Sweep side to side'],
              pairs: [
                { term: 'P', match: 'Pull the pin' },
                { term: 'A', match: 'Aim at base' },
                { term: 'S (first)', match: 'Squeeze handle' },
                { term: 'S (second)', match: 'Sweep side to side' }
              ],
              explanation: 'P.A.S.S. = Pull, Aim, Squeeze, Sweep — the universal fire extinguisher technique.'
            },
            {
              question: 'What is the first step when encountering a major chemical spill?',
              options: [
                'Attempt to clean it up',
                'Evacuate the area immediately',
                'Identify the chemical',
                'Call the supervisor'
              ],
              correct: 1,
              explanation: 'For major spills, evacuate immediately. Do not attempt cleanup until the area is declared safe.',
              optionFeedback: [
                'Dangerous — never attempt cleanup of a major spill without proper training and PPE.',
                '✓ Correct! Evacuate first, then follow spill response procedures from a safe distance.',
                'Identifying the chemical comes after evacuation — your safety comes first.',
                'Not wrong to call your supervisor, but evacuation is the immediate priority.'
              ]
            },
            {
              question: 'You should never use an elevator during a fire evacuation.',
              type: 'true-false',
              correct: true,
              explanation: 'Elevators can become trapped, fill with smoke, or open on a fire floor. Always use stairs.'
            }
          ]
        }
      ]
    },
    {
      id: 'ergonomics',
      title: 'Ergonomics',
      icon: '🪑',
      lessons: [
        {
          id: 'workstation-setup',
          title: 'Workstation Setup',
          type: 'content',
          duration: '3 min',
          content: () => `
            <h2>Creating an Ergonomic Workstation</h2>
            <h3>Monitor Setup</h3>
            <div class="info-box">
              <div class="info-box-title">Monitor Positioning</div>
              <ul style="margin: 12px 0; padding-left: 20px;">
                <li><strong>Distance:</strong> Arm's length away (20-26 inches)</li>
                <li><strong>Height:</strong> Top of screen at or slightly below eye level</li>
                <li><strong>Angle:</strong> Tilted back 10-20 degrees</li>
                <li><strong>Position:</strong> Directly in front of you (no twisting)</li>
              </ul>
            </div>
            <h3>Chair Settings</h3>
            <div class="info-box">
              <div class="info-box-title">Chair Adjustment</div>
              <ul style="margin: 12px 0; padding-left: 20px;">
                <li><strong>Seat height:</strong> Feet flat on floor, thighs parallel to floor</li>
                <li><strong>Backrest:</strong> Support natural curve of lower back</li>
                <li><strong>Armrests:</strong> Allow shoulders to relax, elbows at 90°</li>
                <li><strong>Seat depth:</strong> 2-4 inches between seat edge and back of knees</li>
              </ul>
            </div>
            <h3>Keyboard and Mouse</h3>
            <ul style="padding-left: 20px; margin: 12px 0;">
              <li>Keyboard at elbow height, wrists neutral (not bent)</li>
              <li>Mouse close to keyboard, same height</li>
              <li>Use a wrist rest for resting (not while typing)</li>
              <li>Keep mouse movements from the elbow, not the wrist</li>
            </ul>
            <h3>Ergonomic Video Tutorial</h3>
            <div class="video-player">
              <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px;background:#0d1117;">
                <iframe src="https://www.youtube.com/embed/PCkjlzCTAYs" title="Desk Ergonomics: Set Up Your Workspace for Comfort" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>
              </div>
              <div class="video-caption">Video: Desk Ergonomics — how to adjust your chair, desk, and monitor for comfort and healthy posture.</div>
            </div>
            <h3>Ergonomic Assessment Audio Guide</h3>
            <div class="info-box" style="border-left: 3px solid #667eea;">
              <div class="info-box-title">Workstation Self-Assessment Checklist</div>
              <p style="margin-bottom:8px;">Walk through each item and check your current setup:</p>
              <ol style="padding-left:20px;line-height:2;">
                <li><strong>Monitor:</strong> Top of screen at or slightly below eye level, arm's length away</li>
                <li><strong>Chair:</strong> Feet flat on floor, thighs parallel to ground, lumbar support active</li>
                <li><strong>Keyboard:</strong> Elbows at 90°, wrists neutral (not bent up or down)</li>
                <li><strong>Mouse:</strong> Close to keyboard, same height, minimal reaching</li>
                <li><strong>Lighting:</strong> No glare on screen, overhead light not directly behind you</li>
                <li><strong>Breaks:</strong> Stand and stretch every 30–60 minutes</li>
              </ol>
              <p style="margin-top:8px;font-size:13px;color:#8892a4;">Score yourself: if you answered "yes" to 5 or more, your setup is well-optimized. Fix any "no" items above.</p>
            </div>
            <div class="content-divider"><span class="divider-icon">🪑</span></div>
            <div class="statement-block" id="ergo-statement">
              <div class="statement-text">You should wait until you feel pain before adjusting your workstation setup.</div>
              <div class="statement-buttons">
                <button class="statement-btn agree" onclick="checkStatement('ergo-statement', true, false, '✗ Incorrect. Ergonomic problems develop gradually. Proactive setup prevents injuries before they start — don\'t wait for pain.', '✓ Correct! Proactive ergonomic setup prevents injuries. Adjust your workstation before pain develops.')">Agree</button>
                <button class="statement-btn disagree" onclick="checkStatement('ergo-statement', true, true, '✗ Incorrect. Ergonomic problems develop gradually. Proactive setup prevents injuries before they start — don\'t wait for pain.', '✓ Correct! Proactive ergonomic setup prevents injuries. Adjust your workstation before pain develops.')">Disagree</button>
              </div>
              <div class="statement-feedback" id="ergo-statement-feedback"></div>
            </div>
            <h3>Ergonomic Reference Gallery</h3>
            <div class="info-box" style="padding: 16px;">
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">
                <div style="background:#1a2332;border-radius:8px;padding:16px;text-align:center;">
                  <svg width="120" height="100" viewBox="0 0 120 100" style="margin:0 auto 8px;"><rect x="20" y="10" width="80" height="50" rx="4" fill="#2d3a4e" stroke="#667eea" stroke-width="2"/><rect x="45" y="60" width="30" height="8" rx="2" fill="#4a5568"/><circle cx="60" cy="75" r="4" fill="#667eea"/><line x1="35" y1="82" x2="85" y2="82" stroke="#4a5568" stroke-width="3"/><circle cx="42" cy="35" r="3" fill="#4caf50" opacity="0.8"/><circle cx="60" cy="35" r="3" fill="#4caf50" opacity="0.8"/><circle cx="78" cy="35" r="3" fill="#4caf50" opacity="0.8"/></svg>
                  <div style="font-weight:600;font-size:14px;">Monitor Position</div>
                  <div style="font-size:12px;color:#8892a4;margin-top:4px;">Top of screen at eye level, arm's length away</div>
                </div>
                <div style="background:#1a2332;border-radius:8px;padding:16px;text-align:center;">
                  <svg width="120" height="100" viewBox="0 0 120 100" style="margin:0 auto 8px;"><rect x="30" y="15" width="60" height="55" rx="6" fill="#2d3a4e" stroke="#667eea" stroke-width="2"/><path d="M30 40 L60 55 L90 40" fill="none" stroke="#4caf50" stroke-width="2"/><rect x="45" y="70" width="30" height="6" rx="2" fill="#4a5568"/><circle cx="60" cy="82" r="4" fill="#667eea"/><line x1="35" y1="90" x2="85" y2="90" stroke="#4a5568" stroke-width="3"/></svg>
                  <div style="font-weight:600;font-size:14px;">Chair Adjustment</div>
                  <div style="font-size:12px;color:#8892a4;margin-top:4px;">Lumbar support, feet flat, thighs parallel</div>
                </div>
                <div style="background:#1a2332;border-radius:8px;padding:16px;text-align:center;">
                  <svg width="120" height="100" viewBox="0 0 120 100" style="margin:0 auto 8px;"><rect x="15" y="50" width="90" height="12" rx="3" fill="#2d3a4e" stroke="#667eea" stroke-width="2"/><rect x="25" y="40" width="15" height="10" rx="2" fill="#4caf50"/><rect x="45" y="40" width="15" height="10" rx="2" fill="#4caf50"/><rect x="65" y="40" width="15" height="10" rx="2" fill="#4caf50"/><rect x="85" y="40" width="15" height="10" rx="2" fill="#4caf50"/><ellipse cx="105" cy="56" rx="8" ry="5" fill="#4a5568"/></svg>
                  <div style="font-weight:600;font-size:14px;">Keyboard & Mouse</div>
                  <div style="font-size:12px;color:#8892a4;margin-top:4px;">Elbows at 90°, wrists neutral</div>
                </div>
                <div style="background:#1a2332;border-radius:8px;padding:16px;text-align:center;">
                  <svg width="120" height="100" viewBox="0 0 120 100" style="margin:0 auto 8px;"><circle cx="60" cy="50" r="35" fill="none" stroke="#667eea" stroke-width="2" stroke-dasharray="4 4"/><circle cx="60" cy="50" r="20" fill="#2d3a4e" stroke="#4caf50" stroke-width="2"/><line x1="60" y1="15" x2="60" y2="30" stroke="#f44336" stroke-width="2"/><line x1="60" y1="70" x2="60" y2="85" stroke="#4caf50" stroke-width="2"/><line x1="25" y1="50" x2="40" y2="50" stroke="#4caf50" stroke-width="2"/><line x1="80" y1="50" x2="95" y2="50" stroke="#4caf50" stroke-width="2"/></svg>
                  <div style="font-weight:600;font-size:14px;">Posture Zones</div>
                  <div style="font-size:12px;color:#8892a4;margin-top:4px;">Green = good, Red = avoid slouching</div>
                </div>
                 </div>
              </div>
            </div>
            <div class="quote-block">
              <div class="quote-text">Safe and healthy working conditions for all workers is not just a legal requirement — it is a fundamental human right.</div>
              <div class="quote-author">— International Labour Organization (ILO)</div>
            </div>
          `
        },
        {
          id: 'stretching',
          title: 'Office Stretching Guide',
          type: 'content',
          duration: '2 min',
          content: () => `
            <h2>Microbreak Stretches</h2>
            <p>Perform these every 30-60 minutes for 1-2 minutes each:</p>
            <div class="info-box">
              <div class="info-box-title">Essential Stretches</div>
              <ul style="margin: 12px 0; padding-left: 20px;">
                <li><strong>Neck Rolls:</strong> Slowly rotate head in circles, 5 each direction</li>
                <li><strong>Shoulder Shrugs:</strong> Raise shoulders to ears, hold 5 sec, release</li>
                <li><strong>Chest Opener:</strong> Clasp hands behind back, straighten arms, lift</li>
                <li><strong>Wrist Flex/Extend:</strong> Extend arm, pull fingers back gently</li>
                <li><strong>Seated Spine Twist:</strong> Rotate torso, hold chair back for leverage</li>
                <li><strong>Standing Forward Fold:</strong> Bend at hips, let arms hang</li>
              </ul>
            </div>
            <div class="info-box">
              <div class="info-box-title">The 20-20-20 Rule</div>
              <p>Every 20 minutes, look at something 20 feet away for 20 seconds. This reduces eye strain and helps maintain focus.</p>
            </div>
            <div class="content-divider"><span class="divider-icon">🧘</span></div>
            <div class="statement-block" id="stretching-statement">
              <div class="statement-text">Microbreak stretches should only be done when you feel muscle pain.</div>
              <div class="statement-buttons">
                <button class="statement-btn agree" onclick="checkStatement('stretching-statement', true, false, '✗ Incorrect. Stretches should be performed every 30-60 minutes as a preventive measure, not in response to pain.', '✓ Correct! Preventive microbreaks every 30-60 minutes are key to avoiding musculoskeletal strain.')">Agree</button>
                <button class="statement-btn disagree" onclick="checkStatement('stretching-statement', true, true, '✗ Incorrect. Stretches should be performed every 30-60 minutes as a preventive measure, not in response to pain.', '✓ Correct! Preventive microbreaks every 30-60 minutes are key to avoiding musculoskeletal strain.')">Disagree</button>
              </div>
              <div class="statement-feedback" id="stretching-statement-feedback"></div>
            </div>
          `
        }
      ]
    },
    {
      id: 'reporting',
      title: 'Incident Reporting',
      icon: '📝',
      lessons: [
        {
          id: 'why-report',
          title: 'Why Report Incidents?',
          type: 'content',
          duration: '2 min',
          content: () => `
            <h2>The Importance of Reporting</h2>
            <p>Reporting isn't about blame — it's about prevention and improvement.</p>
            <div class="info-box">
              <div class="info-box-title">Benefits of Reporting</div>
              <ul style="margin: 12px 0; padding-left: 20px;">
                <li><strong>Prevention:</strong> Identify root causes to prevent recurrence</li>
                <li><strong>Trend Analysis:</strong> Spot patterns across departments/locations</li>
                <li><strong>Legal Compliance:</strong> Meet OSHA and state requirements</li>
                <li><strong>Workers Comp:</strong> Ensure injured workers receive benefits</li>
                <li><strong>Safety Culture:</strong> Demonstrate organizational commitment</li>
                <li><strong>Insurance:</strong> Accurate data may reduce premiums</li>
              </ul>
            </div>
            <div class="statement-block" id="reporting-statement">
              <div class="statement-text">Near-miss incidents should be reported even though no one was hurt.</div>
              <div class="statement-buttons">
                <button class="statement-btn agree" onclick="checkStatement('reporting-statement', true, true, '✓ Correct! Near-miss reporting is crucial for preventing future incidents.', '✗ Actually, near-miss reporting is essential for identifying hazards before they cause injuries.')">Agree</button>
                <button class="statement-btn disagree" onclick="checkStatement('reporting-statement', true, false, '✓ Correct! Near-miss reporting is crucial for preventing future incidents.', '✗ Actually, near-miss reporting is essential for identifying hazards before they cause injuries.')">Disagree</button>
              </div>
              <div class="statement-feedback" id="reporting-statement-feedback"></div>
            </div>
            <div class="warning-box">
              <div class="warning-title">What Must Be Reported</div>
              <ul style="margin: 12px 0; padding-left: 20px;">
                <li>Fatalities (within 8 hours)</li>
                <li>In-patient hospitalizations (within 24 hours)</li>
                <li>Amputations (within 24 hours)</li>
                <li>Loss of an eye (within 24 hours)</li>
                <li>All recordable injuries and illnesses</li>
              </ul>
            </div>
          `
        },
        {
          id: 'how-to-report',
          title: 'How to Report',
          type: 'content',
          duration: '2 min',
          content: () => `
            <div class="content-divider"><span class="divider-icon">📋</span></div>
            <h2>Reporting Process</h2>
            <h3>Immediate Actions</h3>
            <div class="info-box">
              <div class="info-box-title">If Someone Is Injured</div>
              <ol style="margin: 12px 0; padding-left: 20px;">
                <li>Call 911 if life-threatening</li>
                <li>Administer first aid if trained</li>
                <li>Do not move injured person unless danger</li>
                <li>Secure the scene</li>
                <li>Notify supervisor immediately</li>
              </ol>
            </div>
            <h3>Documentation</h3>
            <div class="info-box">
              <div class="info-box-title">Complete an Incident Report</div>
              <ul style="margin: 12px 0; padding-left: 20px;">
                <li>Who, what, when, where, how</li>
                <li>Witness names and statements</li>
                <li>Photos of scene and injuries</li>
                <li>Equipment involved and conditions</li>
                <li>PPE being worn at time of incident</li>
              </ul>
            </div>
            <div class="info-box">
              <div class="info-box-title">Near-Miss Reporting</div>
              <p>A near-miss is an event that could have caused injury but didn't. Reporting near-misses is critical — they're warning signs of potential future incidents. Near-miss reporting should be non-punitive.</p>
            </div>
            <h3>Interactive Incident Reporting Practice</h3>
            <div id="incident-report-form" style="background:#1a2332;border-radius:12px;padding:24px;border:1px solid #2d3a4e;">
              <div style="font-weight:700;font-size:18px;margin-bottom:16px;color:#e2e8f0;">📋 Incident Report Form</div>
              <p style="font-size:14px;color:#8892a4;margin-bottom:16px;">Fill out this simulated incident report. All fields are required.</p>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:12px;">
                <div><label for="ir-date" style="font-size:12px;color:#8892a4;display:block;margin-bottom:4px;">Date of Incident</label><input type="date" id="ir-date" class="ir-field" style="width:100%;padding:8px 12px;background:#0d1117;border:1px solid #2d3a4e;border-radius:6px;color:#e2e8f0;font-size:14px;"></div>
                <div><label for="ir-time" style="font-size:12px;color:#8892a4;display:block;margin-bottom:4px;">Time of Incident</label><input type="time" id="ir-time" class="ir-field" style="width:100%;padding:8px 12px;background:#0d1117;border:1px solid #2d3a4e;border-radius:6px;color:#e2e8f0;font-size:14px;"></div>
              </div>
              <div style="margin-bottom:12px;"><label for="ir-location" style="font-size:12px;color:#8892a4;display:block;margin-bottom:4px;">Location</label><input type="text" id="ir-location" class="ir-field" placeholder="e.g. Warehouse B, Aisle 3" style="width:100%;padding:8px 12px;background:#0d1117;border:1px solid #2d3a4e;border-radius:6px;color:#e2e8f0;font-size:14px;"></div>
              <div style="margin-bottom:12px;"><label for="ir-type" style="font-size:12px;color:#8892a4;display:block;margin-bottom:4px;">Type of Incident</label><select id="ir-type" class="ir-field" style="width:100%;padding:8px 12px;background:#0d1117;border:1px solid #2d3a4e;border-radius:6px;color:#e2e8f0;font-size:14px;"><option value="">Select type...</option><option value="injury">Injury</option><option value="near-miss">Near Miss</option><option value="property-damage">Property Damage</option><option value="chemical-spill">Chemical Spill</option><option value="fire">Fire</option><option value="other">Other</option></select></div>
              <div style="margin-bottom:12px;"><label for="ir-desc" style="font-size:12px;color:#8892a4;display:block;margin-bottom:4px;">Description of Incident</label><textarea id="ir-desc" class="ir-field" rows="3" placeholder="Describe what happened..." style="width:100%;padding:8px 12px;background:#0d1117;border:1px solid #2d3a4e;border-radius:6px;color:#e2e8f0;font-size:14px;resize:vertical;"></textarea></div>
              <div style="margin-bottom:12px;"><label for="ir-injuries" style="font-size:12px;color:#8892a4;display:block;margin-bottom:4px;">Injuries Sustained</label><textarea id="ir-injuries" class="ir-field" rows="2" placeholder="Describe any injuries..." style="width:100%;padding:8px 12px;background:#0d1117;border:1px solid #2d3a4e;border-radius:6px;color:#e2e8f0;font-size:14px;resize:vertical;"></textarea></div>
              <div style="margin-bottom:12px;"><label for="ir-witnesses" style="font-size:12px;color:#8892a4;display:block;margin-bottom:4px;">Witnesses Present</label><input type="text" id="ir-witnesses" class="ir-field" placeholder="Names of witnesses" style="width:100%;padding:8px 12px;background:#0d1117;border:1px solid #2d3a4e;border-radius:6px;color:#e2e8f0;font-size:14px;"></div>
              <div style="margin-bottom:16px;"><label for="ir-actions" style="font-size:12px;color:#8892a4;display:block;margin-bottom:4px;">Corrective Actions Taken</label><textarea id="ir-actions" class="ir-field" rows="2" placeholder="What immediate actions were taken?" style="width:100%;padding:8px 12px;background:#0d1117;border:1px solid #2d3a4e;border-radius:6px;color:#e2e8f0;font-size:14px;resize:vertical;"></textarea></div>
              <button class="btn btn-primary" onclick="submitIncidentReport()" style="width:100%;">Submit Report</button>
              <div id="ir-feedback" style="margin-top:12px;display:none;"></div>
            </div>
            <h3>Reference Materials</h3>
            <div class="info-box" style="margin-bottom:12px;">
              <div class="info-box-title">OSHA 300 Log — Recording Work-Related Injuries</div>
              <p style="margin:8px 0;font-size:14px;color:#1a2332;">Employers must record all work-related injuries and illnesses on the OSHA 300 Log. The log tracks the worker's name, job title, date of injury, where it happened, a description, and classification (death, days away, restricted work, or other recordable case).</p>
              <div style="background:#0d1117;border-radius:8px;padding:12px;margin:8px 0;font-size:13px;font-family:monospace;color:#8892a4;overflow-x:auto;">
                <div style="font-weight:700;color:#e2e8f0;margin-bottom:6px;">OSHA Form 300 — Key Columns:</div>
                <div>A. Case No. &nbsp;| B. Worker Name &nbsp;| C. Job Title</div>
                <div>D. Date of Injury &nbsp;| E. Where Event Occurred</div>
                <div>F. Description of Injury &nbsp;| G. Classify: Death / Days Away / Restricted / Other</div>
              </div>
              <p style="font-size:13px;color:#2d3a4e;"><strong>Retain for 5 years</strong> — post annually from Feb 1 to April 30. <a href="https://www.osha.gov/recordkeeping" target="_blank" style="color:#1565c0;">OSHA Recordkeeping Rules →</a></p>
            </div>
            <div class="info-box" style="margin-bottom:12px;">
              <div class="info-box-title">Incident Investigation Checklist</div>
              <p style="margin:8px 0;font-size:14px;color:#1a2332;">A thorough investigation identifies root causes, not just immediate triggers. Complete all steps within 24 hours of the incident while evidence is fresh.</p>
              <div style="background:#0d1117;border-radius:8px;padding:12px;margin:8px 0;font-size:13px;color:#8892a4;">
                <div style="font-weight:700;color:#e2e8f0;margin-bottom:6px;">Investigation Steps:</div>
                <div style="display:grid;grid-template-columns:auto 1fr;gap:4px 12px;">
                  <span style="color:#4caf50;">1.</span><span>Secure the scene — preserve evidence, restrict access</span>
                  <span style="color:#4caf50;">2.</span><span>Provide medical aid to injured persons</span>
                  <span style="color:#4caf50;">3.</span><span>Identify witnesses — record names and contact info</span>
                  <span style="color:#4caf50;">4.</span><span>Document conditions — photos, weather, lighting, noise</span>
                  <span style="color:#4caf50;">5.</span><span>Collect physical evidence — tools, PPE, equipment state</span>
                  <span style="color:#4caf50;">6.</span><span>Interview witnesses separately — what did they see/hear?</span>
                  <span style="color:#4caf50;">7.</span><span>Identify root causes — use 5-Whys or fishbone analysis</span>
                  <span style="color:#4caf50;">8.</span><span>Document findings — complete OSHA 301 Incident Report</span>
                  <span style="color:#4caf50;">9.</span><span>Implement corrective actions — assign owners and deadlines</span>
                  <span style="color:#4caf50;">10.</span><span>Follow up — verify corrective actions are effective</span>
                </div>
              </div>
            </div>
            <div class="info-box">
              <div class="info-box-title">Quick Reference — Reporting Deadlines</div>
              <div style="background:#0d1117;border-radius:8px;padding:12px;margin:8px 0;font-size:13px;color:#8892a4;">
                <div style="display:grid;grid-template-columns:auto 1fr;gap:4px 12px;">
                  <span style="color:#ff9800;font-weight:700;">Fatalities</span><span>Report to OSHA within <strong style="color:#e2e8f0;">8 hours</strong></span>
                  <span style="color:#ff9800;font-weight:700;">In-patient Hospitalization</span><span>Report to OSHA within <strong style="color:#e2e8f0;">24 hours</strong></span>
                  <span style="color:#ff9800;font-weight:700;">Amputation / Eye Loss</span><span>Report to OSHA within <strong style="color:#e2e8f0;">24 hours</strong></span>
                  <span style="color:#ff9800;font-weight:700;">OSHA 300 Log</span><span>Post Feb 1 – Apr 30 annually</span>
                  <span style="color:#ff9800;font-weight:700;">Record Retention</span><span>Maintain for <strong style="color:#e2e8f0;">5 years</strong></span>
                </div>
              </div>
            </div>
          `
        }
      ]
    },
    {
      id: 'assessment',
      title: 'Final Assessment',
      icon: '🎓',
      lessons: [
        {
          id: 'final-quiz',
          title: 'Final Exam',
          type: 'assessment',
          duration: '10 min',
          passScore: 80,
          questions: [
            {
              question: 'When was OSHA established?',
              options: ['1960', '1965', '1970', '1975'],
              correct: 2,
              explanation: 'OSHA was established in 1970 under the Occupational Safety and Health Act.',
              optionFeedback: ['No — that\'s a decade too early.', 'No — still five years early.', '✓ Correct! Signed into law Dec 29, 1970.', 'No — five years after OSHA was created.']
            },
            {
              question: 'Which is the MOST effective hazard control according to the hierarchy of controls?',
              options: ['PPE', 'Engineering controls', 'Elimination', 'Administrative controls'],
              correct: 2,
              explanation: 'Elimination is the most effective because it removes the hazard entirely.',
              optionFeedback: ['PPE is the LEAST effective — it relies on human behavior.', 'Engineering controls are second-best — they isolate people from hazards.', '✓ Correct! Elimination removes the hazard completely.', 'Administrative controls are third — they change how people work.']
            },
            {
              question: 'The hierarchy of controls lists PPE as the LEAST effective method.',
              type: 'true-false',
              correct: true,
              explanation: 'PPE is the least effective because it relies on human behavior and can fail. Elimination is most effective.'
            },
            {
              question: 'OSHA sets the maximum permissible noise exposure at what decibel level (8-hour TWA)?',
              type: 'fill-blank',
              answer: '85',
              hint: 'A two-digit number above 80',
              explanation: 'OSHA requires hearing protection for exposure above 85 dB over an 8-hour time-weighted average.'
            },
            {
              question: 'What does the "E" in R.A.C.E. stand for?',
              options: ['Escape', 'Evacuate/Extinguish', 'Emergency', 'Exit'],
              correct: 1,
              explanation: 'R.A.C.E. = Rescue, Alarm, Contain, Evacuate/Extinguish.',
              optionFeedback: ['Close — but "Escape" is too narrow. It\'s Evacuate OR Extinguish.', '✓ Correct! The "E" covers both evacuation and extinguishing.', '"Emergency" starts with E but isn\'t what R.A.C.E. stands for.', '"Exit" is related but not the correct term.']
            },
            {
              question: 'What is the FIRST step in the P.A.S.S. fire extinguisher technique?',
              options: ['Aim at the fire', 'Pull the safety pin', 'Squeeze the handle', 'Sweep side to side'],
              correct: 1,
              explanation: 'P.A.S.S. starts with Pull the safety pin.',
              optionFeedback: ['Aim comes second — you need to pull the pin first!', '✓ Correct! P = Pull the safety pin.', 'Squeeze comes third — after Pull and Aim.', 'Sweep comes last — the final step.']
            },
            {
              question: 'What should you do immediately when encountering a major chemical spill?',
              options: [
                'Clean it up immediately',
                'Evacuate the area',
                'Take a photo',
                'Wait for it to evaporate'
              ],
              correct: 1,
              explanation: 'Evacuate immediately for major spills. Do not attempt cleanup until area is declared safe.',
              optionFeedback: ['Dangerous! Never attempt cleanup without proper training and PPE.', '✓ Correct! Evacuate immediately for major spills.', 'Photos can wait — your safety comes first.', 'Some chemicals don\'t evaporate safely and can cause harm.']
            },
            {
              question: 'Which type of hazard includes repetitive typing motions?',
              options: ['Chemical', 'Physical', 'Ergonomic', 'Biological'],
              correct: 2,
              explanation: 'Repetitive motions are ergonomic hazards that can cause musculoskeletal disorders.',
              optionFeedback: ['Chemical hazards involve exposure to substances (solvents, fumes).', 'Physical hazards include noise, radiation, temperature extremes.', '✓ Correct! Repetitive motions are ergonomic hazards.', 'Biological hazards include bacteria, viruses, bloodborne pathogens.']
            },
            {
              question: 'What is the correct order for doffing (removing) PPE?',
              options: [
                'Mask first, then gloves',
                'Gloves first, then gown, then mask',
                'Goggles first, then gloves',
                'Any order is fine'
              ],
              correct: 1,
              explanation: 'Doff from most contaminated to least: gloves → hand hygiene → goggles → gown → mask.',
              optionFeedback: ['Wrong — mask should be last, not first. Start with gloves.', '✓ Correct! Gloves → hygiene → goggles → gown → mask.', 'Goggles come after gloves and hand hygiene.', 'Order matters! Wrong order can cause contamination.']
            },
            {
              question: 'Within how many hours must fatalities be reported to OSHA?',
              options: ['4 hours', '8 hours', '24 hours', '48 hours'],
              correct: 1,
              explanation: 'Fatalities must be reported to OSHA within 8 hours.',
              optionFeedback: ['4 hours is too tight — the actual requirement is 8.', '✓ Correct! Fatalities: 8 hours. Hospitalizations: 24 hours.', '24 hours is for hospitalizations, not fatalities.', '48 hours is not a OSHA reporting timeframe.']
            },
            {
              question: 'What is a "near-miss"?',
              options: [
                'A type of injury',
                'An event that could have caused injury but didn\'t',
                'A type of PPE',
                'An OSHA violation'
              ],
              correct: 1,
              explanation: 'A near-miss is a warning sign — an event that could have resulted in injury but didn\'t.',
              optionFeedback: ['A near-miss is specifically an event that did NOT cause injury.', '✓ Correct! Near-misses are warning signs — report them!', 'PPE and near-misses are unrelated concepts.', 'Near-misses are not violations — failing to report them might be.']
            },
            {
              question: 'How far should your monitor be from your eyes?',
              options: ['6-10 inches', '12-16 inches', '20-26 inches', '30-36 inches'],
              correct: 2,
              explanation: 'Monitors should be arm\'s length away, approximately 20-26 inches.',
              optionFeedback: ['Way too close — this would cause significant eye strain.', 'Still too close — that\'s less than two feet.', '✓ Correct! Arm\'s length = 20-26 inches.', 'A bit too far for most people — you\'d lean forward to read.']
            },
            {
              question: 'What does the "G" in GHS stand for?',
              options: ['General', 'Global', 'Government', 'Generic'],
              correct: 1,
              explanation: 'GHS stands for Globally Harmonized System of Classification and Labelling of Chemicals.',
              optionFeedback: ['Not "General" — it\'s an international standard.', '✓ Correct! GHS = Globally Harmonized System.', '"Government" is close but not what G stands for.', '"Generic" misses the international scope of GHS.']
            },
            {
              question: 'Which employer must be notified of a hospitalized worker within 24 hours?',
              options: [
                'The employee\'s personal doctor',
                'OSHA',
                'The local fire department',
                'The insurance company'
              ],
              correct: 1,
              explanation: 'OSHA must be notified of in-patient hospitalizations within 24 hours.',
              optionFeedback: ['The doctor treats the patient but doesn\'t need OSHA notification.', '✓ Correct! OSHA requires 24-hour notification for hospitalizations.', 'Fire department is for emergencies, not hospitalization reporting.', 'Insurance is notified through workers\' comp claims, not OSHA.']
            },
            {
              question: 'What is the 20-20-20 rule for eye strain?',
              options: [
                'Every 20 min, look 20 ft away for 20 sec',
                'Every 20 sec, blink 20 times',
                'Every 20 min, close eyes for 20 sec',
                'Every 20 ft, look up for 20 sec'
              ],
              correct: 0,
              explanation: 'The 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds.',
              optionFeedback: ['✓ Correct! Every 20 minutes → 20 feet → 20 seconds.', 'Blinking helps, but that\'s not the 20-20-20 rule.', 'Closing eyes helps, but the rule specifically says look at something far away.', 'The distance is 20 feet, not "every 20 ft of walking."']
            },
            {
              question: 'Which of these is NOT a type of PPE?',
              options: ['Safety glasses', 'Earplugs', 'Work instructions', 'Gloves'],
              correct: 2,
              explanation: 'Work instructions are administrative controls, not PPE. PPE protects the body directly.',
              optionFeedback: ['Safety glasses are eye PPE — they protect directly.', 'Earplugs are hearing PPE.', '✓ Correct! Work instructions are administrative controls, not physical PPE.', 'Gloves are hand PPE — they protect directly.']
            },
            {
              question: 'What is the hierarchy of controls\' least effective method?',
              options: ['Elimination', 'Engineering controls', 'PPE', 'Substitution'],
              correct: 2,
              explanation: 'PPE is the least effective control because it relies on human behavior and can fail.',
              optionFeedback: ['Elimination is actually the MOST effective!', 'Engineering controls are second most effective.', '✓ Correct! PPE is least effective — it\'s the last line of defense.', 'Substitution is third most effective.']
            },
            {
              question: 'When should ergonomic microbreak stretches be performed?',
              options: [
                'Only when in pain',
                'Every 30-60 minutes',
                'Once a day',
                'Only on Fridays'
              ],
              correct: 1,
              explanation: 'Microbreak stretches should be performed every 30-60 minutes to prevent musculoskeletal strain.',
              optionFeedback: ['Waiting for pain means you\'ve already developed a problem.', '✓ Correct! Every 30-60 minutes for 1-2 minutes each.', 'Once a day isn\'t frequent enough to prevent repetitive strain.', 'Stretching should be a daily habit, not just one day a week.']
            },
            {
              question: 'What is the maximum OSHA fine per serious violation (2024)?',
              options: ['$5,000', '$10,000', '$15,625', '$25,000'],
              correct: 2,
              explanation: 'The maximum OSHA fine per serious violation is $15,625 (as of 2024).',
              optionFeedback: ['Too low — OSHA fines can be much higher.', 'Still under the actual maximum.', '✓ Correct! $15,625 per serious violation (2024 rates).', 'That exceeds the current maximum.']
            },
            {
              question: 'Which action should be taken FIRST when someone is injured?',
              options: [
                'Fill out paperwork',
                'Call 911 if life-threatening',
                'Move the person to safety',
                'Take photos'
              ],
              correct: 1,
              explanation: 'Always call 911 first for life-threatening injuries. Safety of the injured person is the top priority.',
              optionFeedback: ['Paperwork can wait — the person needs help now.', '✓ Correct! Life-threatening = call 911 immediately.', 'Moving an injured person can worsen injuries — only move if there\'s immediate danger.', 'Photos are for documentation later, not first response.']
            },
            {
              question: 'What should near-miss reporting be?',
              options: [
                'Punitive to prevent recurrence',
                'Non-punitive to encourage reporting',
                'Optional for workers',
                'Only for supervisors'
              ],
              correct: 1,
              explanation: 'Near-miss reporting should be non-punitive to encourage workers to report without fear of retaliation.',
              optionFeedback: ['Punitive reporting discourages workers from reporting.', '✓ Correct! Non-punitive reporting encourages open communication.', 'Near-miss reporting should be mandatory, not optional.', 'Everyone — workers, supervisors, visitors — should report near-misses.']
            }
          ]
        }
      ]
    }
  ];

  function init() {
    SCORMWrapper.init();
    loadSuspendData();
    renderSidebar();
    renderContent();
    updateProgress();
    startTimer();
    // Collapse sidebar on mobile/tablet by default
    const sidebar = document.getElementById('sidebar');
    const toggleWrap = document.getElementById('sidebar-toggle-wrap');
    if (sidebar && window.innerWidth <= 1023) {
      sidebar.classList.add('collapsed');
    }
    if (sidebar && toggleWrap) {
      const isCollapsed = sidebar.classList.contains('collapsed');
      toggleWrap.style.left = isCollapsed ? '0px' : '280px';
    }
  }

  function loadSuspendData() {
    const data = SCORMWrapper.getSuspend();
    if (data) {
      try {
        const parsed = JSON.parse(data);
        state.completedLessons = new Set(parsed.completedLessons || []);
        state.scores = parsed.scores || {};
        state.currentSection = parsed.currentSection || 0;
        state.currentLesson = parsed.currentLesson || 0;
        state.quizAttempts = parsed.quizAttempts || {};
      } catch(e) {}
    }
  }

  function saveSuspendData() {
    const data = {
      completedLessons: Array.from(state.completedLessons),
      scores: state.scores,
      currentSection: state.currentSection,
      currentLesson: state.currentLesson,
      quizAttempts: state.quizAttempts
    };
    SCORMWrapper.suspend(JSON.stringify(data));
  }

  function startTimer() {
    setInterval(() => {
      const elapsed = Math.floor((Date.now() - state.startTime) / 60000);
      const timer = document.getElementById('session-timer');
      if (timer) timer.textContent = `Session: ${elapsed} min`;
    }, 60000);
  }

  /* ─── Section Locking Helpers ─── */
  const ASSESSMENT_GATES = [
    { sectionIndex: 1, lessonIndex: 4, lessonId: 'osha-knowledge-check' },
    { sectionIndex: 4, lessonIndex: 3, lessonId: 'emergency-quiz' }
  ];

  function isAssessmentPassed(sectionIndex, lessonIndex) {
    const lesson = sections[sectionIndex]?.lessons[lessonIndex];
    if (!lesson) return false;
    return state.scores[lesson.id]?.passed === true;
  }

  function isSectionLocked(si) {
    if (si <= 1) return false;
    if (si >= 2 && si <= 4) return !isAssessmentPassed(1, 4);
    if (si >= 5 && si <= 7) return !isAssessmentPassed(1, 4) || !isAssessmentPassed(4, 3);
    return false;
  }

  function isLessonAccessible(si, li) {
    if (isSectionLocked(si)) return false;
    for (const gate of ASSESSMENT_GATES) {
      if (si === gate.sectionIndex && li > gate.lessonIndex) {
        if (!isAssessmentPassed(gate.sectionIndex, gate.lessonIndex)) return false;
      }
    }
    return true;
  }

  function isCourseComplete() {
    return isAssessmentPassed(1, 3) && isAssessmentPassed(4, 3) && isAssessmentPassed(7, 0);
  }

  /* Check course completion by reading fresh data from localStorage,
     bypassing the IIFE closure state which may be stale due to
     the SCORM wrapper's beforeunload handler overwriting saves. */
  function isCourseCompleteFresh() {
    try {
      const raw = localStorage.getItem('scorm_wrapper_data');
      if (!raw) return false;
      const wd = JSON.parse(raw);
      const suspendData = wd['cmi.suspend_data'];
      if (!suspendData) return false;
      const parsed = JSON.parse(suspendData);
      const scores = (typeof parsed === 'string') ? JSON.parse(parsed).scores : parsed.scores;
      if (!scores) return false;
      return scores['osha-knowledge-check']?.passed === true
          && scores['emergency-quiz']?.passed === true
          && scores['final-quiz']?.passed === true;
    } catch (e) {
      return false;
    }
  }

  function showCertificate() {
    const overlay = document.createElement('div');
    overlay.className = 'certificate-overlay';
    overlay.id = 'certificate-overlay';
    overlay.innerHTML = `
      <div class="certificate-modal">
        <div id="certificate-content" style="padding: 40px; font-family: 'Georgia', serif; border: 3px solid #1a237e; border-radius: 8px; background: linear-gradient(135deg, #fafbff 0%, #f0f3ff 100%);">
          <div style="text-align: center; margin-bottom: 8px;">
            <div style="font-size: 13px; letter-spacing: 3px; text-transform: uppercase; color: #1a237e; font-weight: bold;">Workplace Safety Compliance Training</div>
          </div>
          <div style="text-align: center; margin: 20px 0 10px;">
            <div style="width: 60px; height: 2px; background: #1a237e; margin: 0 auto 20px;"></div>
            <div style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #888; margin-bottom: 8px;">Certificate of Completion</div>
            <div style="font-size: 14px; color: #666;">This is to certify that</div>
          </div>
          <div style="text-align: center; margin: 15px 0;">
            <div style="font-size: 28px; font-weight: bold; color: #1a237e; border-bottom: 2px solid #1a237e; padding-bottom: 6px; display: inline-block; min-width: 300px;">${state.learnerName || 'Workplace Safety Learner'}</div>
          </div>
          <div style="text-align: center; margin: 15px 0; font-size: 14px; color: #555; line-height: 1.8;">
            has successfully completed all requirements of the<br>
            <strong style="color: #1a237e;">Workplace Safety Compliance Training Program</strong><br>
            <span style="font-size: 12px; color: #888;">including OSHA Fundamentals, Hazard Identification, PPE,<br>Emergency Procedures, Ergonomics, and Incident Reporting</span>
          </div>
          <div style="text-align: center; margin: 10px 0;">
            <div style="font-size: 12px; color: #888;">Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
          </div>
          <div style="display: flex; justify-content: space-between; margin-top: 30px; padding: 0 20px;">
            <div style="text-align: center; width: 180px;">
              <div style="border-top: 1px solid #333; padding-top: 6px; font-size: 12px; color: #555;">${state.learnerName || 'Program Director'}</div>
              <div style="font-size: 10px; color: #888; margin-top: 2px;">Program Director</div>
            </div>
            <div style="text-align: center; width: 180px;">
              <div style="border-top: 1px solid #333; padding-top: 6px; font-size: 12px; color: #555;">Workplace Safety Institute</div>
              <div style="font-size: 10px; color: #888; margin-top: 2px;">Issuing Organization</div>
            </div>
          </div>
        </div>
        <div class="certificate-actions">
          <button class="btn-print" onclick="window.print()">Print Certificate</button>
          <button class="btn-close" onclick="document.getElementById('certificate-overlay').remove()">Close</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
  }

  window.showCertificate = showCertificate;

  function renderSidebar() {
    const sidebar = document.getElementById('sidebar');
    const nav = document.getElementById('nav-sections');
    nav.innerHTML = '';

    sections.forEach((section, si) => {
      const locked = isSectionLocked(si);
      const sectionEl = document.createElement('div');
      sectionEl.className = 'nav-section' + (si === state.currentSection ? ' active' : '');

      const header = document.createElement('div');
      header.className = 'nav-section-header';
      header.innerHTML = `<span>${locked ? '🔒 ' : ''}${section.icon ? section.icon + ' ' : ''}${section.title}</span><span class="nav-chevron">▶</span>`;
      header.onclick = () => {
        sectionEl.classList.toggle('collapsed');
        header.querySelector('.nav-chevron').textContent =
          sectionEl.classList.contains('collapsed') ? '▶' : '▼';
      };
      sectionEl.appendChild(header);

      const lessons = document.createElement('div');
      lessons.className = 'nav-lessons';

      section.lessons.forEach((lesson, li) => {
        const accessible = isLessonAccessible(si, li);
        const lessonEl = document.createElement('div');
        lessonEl.className = 'nav-lesson' +
          (si === state.currentSection && li === state.currentLesson ? ' active' : '') +
          (state.completedLessons.has(`${si}-${li}`) ? ' completed' : '') +
          (!accessible ? ' locked' : '');

        const icon = state.completedLessons.has(`${si}-${li}`) ? '<span class="checkmark-animated" role="img" aria-label="Completed"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="25"/><path d="M14.1 27.2l7.1 7.2 16.7-16.8"/></svg></span>' : (!accessible ? '<span class="lock-indicator">🔒</span>' : '');
        lessonEl.innerHTML = `<span>${icon}</span><span>${lesson.title}</span>`;
        if (accessible) lessonEl.onclick = () => navigateTo(si, li);
        lessons.appendChild(lessonEl);
      });

      sectionEl.appendChild(lessons);
      nav.appendChild(sectionEl);
    });

    const progress = document.getElementById('sidebar-progress');
    const total = sections.reduce((acc, s) => acc + s.lessons.length, 0);
    const completed = state.completedLessons.size;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    progress.innerHTML = `<div class="progress-bar" style="height: 6px; background: rgba(255,255,255,0.2); border-radius: 3px; margin-top: 12px;"><div class="progress-fill" style="height: 100%; width: ${pct}%; background: #48BB78; border-radius: 3px;"></div></div><div style="text-align: center; margin-top: 8px; font-size: 12px;">${completed}/${total} lessons (${pct}%)</div>`;

    const certContainer = document.getElementById('sidebar-certificate');
    if (isCourseCompleteFresh()) {
      certContainer.innerHTML = '<button class="sidebar-cert-btn unlocked" onclick="showCertificate()"><span class="cert-icon">🏆</span> View Certificate</button>';
    } else {
      certContainer.innerHTML = '<button class="sidebar-cert-btn locked" disabled><span class="cert-icon">🔒</span> Complete all assessments to unlock</button>';
    }
  }

  function renderContent() {
    const content = document.getElementById('content');
    const section = sections[state.currentSection];
    const lesson = section.lessons[state.currentLesson];

    document.getElementById('breadcrumb').innerHTML =
      `<span class="breadcrumb-item"><a class="breadcrumb-item-link" href="javascript:void(0)" onclick="navigateTo(0,0)" aria-label="Go to Introduction">Course Home</a></span>` +
      `<span class="breadcrumb-separator">›</span>` +
      `<span class="breadcrumb-item"><a class="breadcrumb-item-link" href="javascript:void(0)" onclick="navigateTo(${state.currentSection},0)" aria-label="Go to ${section.title}">${section.title}</a></span>` +
      `<span class="breadcrumb-separator">›</span>` +
      `<span class="breadcrumb-item"><span aria-current="page">${lesson.title}</span></span>`;

    document.getElementById('lesson-title').textContent = lesson.title;
    document.getElementById('lesson-duration').textContent = lesson.duration;

    // Show locked overlay if section is locked
    if (isSectionLocked(state.currentSection)) {
      let requiredQuizzes = '';
      if (state.currentSection >= 2 && state.currentSection <= 4) {
        requiredQuizzes = '<ul><li>OSHA Fundamentals Knowledge Check (Section 1, Lesson 4)</li></ul>';
      } else if (state.currentSection >= 5) {
        requiredQuizzes = '<ul><li>OSHA Fundamentals Knowledge Check (Section 1, Lesson 4)</li><li>Emergency Procedures Quiz (Section 5, Lesson 3)</li></ul>';
      }
      content.innerHTML = `
        <div class="section-locked-overlay">
          <div class="lock-icon">🔒</div>
          <h2>Section Locked</h2>
          <p>Complete the required assessments in previous sections to unlock this content.</p>
          <div class="required-quizzes">
            <strong>Required assessments:</strong>
            ${requiredQuizzes}
          </div>
        </div>`;
      document.getElementById('btn-prev').disabled = true;
      document.getElementById('btn-next').disabled = true;
      return;
    }

    let html = '';
    if (lesson.type === 'quiz' || lesson.type === 'assessment') {
      html = renderQuiz(lesson);
    } else if (lesson.type === 'drag-drop') {
      html = renderDragDrop(lesson);
    } else if (lesson.type === 'sorting') {
      html = renderSorting(lesson);
    } else if (lesson.type === 'confidence') {
      html = renderConfidence(lesson);
    } else {
      html = lesson.content();
    }

    content.innerHTML = html;

    if (lesson.type === 'quiz' || lesson.type === 'assessment') {
      initQuiz(lesson);
    } else if (lesson.type === 'drag-drop') {
      initDragDrop(lesson);
    } else if (lesson.type === 'sorting') {
      initSorting(lesson);
    }

    // Initialize interactive components
    initAccordions();
    initTabs();
    initTimelines();
    initHotspots();
    initFlashcards();
    initScenarios();
    initGalleries();

    content.scrollTop = 0;

    document.getElementById('btn-prev').disabled = (state.currentSection === 0 && state.currentLesson === 0);
    document.getElementById('btn-next').disabled = (state.currentSection === sections.length - 1 && state.currentLesson === section.lessons.length - 1);

    const key = `${state.currentSection}-${state.currentLesson}`;
    if (!state.completedLessons.has(key) && lesson.type !== 'quiz' && lesson.type !== 'assessment' && lesson.type !== 'drag-drop') {
      setTimeout(() => {
        state.completedLessons.add(key);
        saveSuspendData();
        renderSidebar();
        updateProgress();
      }, 3000);
    }
  }

  function renderQuiz(lesson) {
    let html = '';
    if (lesson.type === 'assessment') {
      html += `<div class="info-box"><div class="info-box-title">Final Assessment</div><p>This assessment contains ${lesson.questions.length} questions. You need ${lesson.passScore}% to pass. You have ${Math.max(0, state.maxAttempts - (state.quizAttempts[lesson.id] || 0))} attempt(s) remaining.</p></div>`;
    }
    html += '<div id="quiz-container" aria-label="Quiz questions">';
    lesson.questions.forEach((q, i) => {
      html += `<div class="quiz-question" id="q${i}" role="group" aria-label="Question ${i + 1} of ${lesson.questions.length}">`;
      html += `<div class="quiz-question-text">${i + 1}. ${q.question}</div>`;

      if (q.type === 'true-false') {
        html += `<div class="tf-options" role="radiogroup" aria-label="True or False">`;
        html += `<button class="tf-btn" data-question="${i}" data-value="true" onclick="QuizEngine.selectTF(${i}, true)" aria-label="True">True</button>`;
        html += `<button class="tf-btn" data-question="${i}" data-value="false" onclick="QuizEngine.selectTF(${i}, false)" aria-label="False">False</button>`;
        html += `</div>`;
      } else if (q.type === 'fill-blank') {
        html += `<div style="margin-top: 10px;">`;
        html += `<input type="text" class="fill-blank-input" id="blank-${i}" placeholder="Type your answer" aria-label="Your answer for question ${i + 1}" autocomplete="off" oninput="QuizEngine.checkFillBlank()">`;
        if (q.hint) html += `<div class="fill-blank-hint" id="hint-${i}">Hint: ${q.hint}</div>`;
        html += `</div>`;
      } else if (q.type === 'matching') {
        html += `<div class="matching-container" role="group" aria-label="Matching pairs">`;
        const shuffledOptions = [...q.options].sort(() => Math.random() - 0.5);
        q.pairs.forEach((pair, pi) => {
          html += `<div class="matching-row">`;
          html += `<span class="matching-term" id="match-term-${i}-${pi}">${pair.term}</span>`;
          html += `<span class="matching-arrow">→</span>`;
          html += `<select class="matching-select" id="match-select-${i}-${pi}" onchange="QuizEngine.checkMatching()" aria-label="Match for ${pair.term}">`;
          html += `<option value="">-- Select --</option>`;
          shuffledOptions.forEach((opt, oi) => {
            html += `<option value="${opt}">${opt}</option>`;
          });
          html += `</select></div>`;
        });
        html += `</div>`;
      } else {
        html += `<div class="quiz-options" role="radiogroup" aria-label="Answer options">`;
        q.options.forEach((opt, j) => {
          html += `<div class="quiz-option" role="radio" aria-checked="false" data-question="${i}" data-option="${j}" tabindex="0" onclick="QuizEngine.selectOption(${i}, ${j})" onkeydown="if(event.key===' '||event.key==='Enter'){event.preventDefault();QuizEngine.selectOption(${i},${j});}"><span class="quiz-option-marker">${String.fromCharCode(65 + j)}</span><span>${opt}</span></div>`;
          if (q.optionFeedback && q.optionFeedback[j]) {
            html += `<div class="quiz-option-feedback" id="opt-fb-${i}-${j}"></div>`;
          }
        });
        html += `</div>`;
      }
      html += `<div class="quiz-feedback" id="feedback${i}" role="alert" aria-live="polite"></div></div>`;
    });
    html += '</div>';
    html += `<div style="text-align: center; margin-top: 24px;"><button class="btn btn-primary" id="btn-submit-quiz" onclick="QuizEngine.submitQuiz()" disabled aria-label="Submit assessment">Submit Assessment</button></div>`;
    html += '<div id="quiz-results" role="region" aria-live="polite" aria-label="Quiz results" style="display:none;"></div>';
    return html;
  }

  function renderDragDrop(lesson) {
    let html = `<div class="info-box"><div class="info-box-title">Drag and Drop Activity</div><p>Drag each hazard to its correct category. All items must be correctly placed to complete this activity.</p></div>`;
    html += '<div class="drag-drop-container">';
    html += '<div class="drag-drop-items" id="drag-items">';
    const shuffled = [...lesson.items].sort(() => Math.random() - 0.5);
    shuffled.forEach(item => {
      html += `<div class="drag-item" draggable="true" data-id="${item.id}" data-correct="${item.correct}">${item.text}</div>`;
    });
    html += '</div>';
    html += '<div class="drag-drop-zones">';
    lesson.zones.forEach(zone => {
      html += `<div class="drop-zone" data-zone="${zone.id}"><div class="drop-zone-label">${zone.label}</div></div>`;
    });
    html += '</div></div>';
    html += '<div style="text-align: center; margin-top: 16px;"><button class="btn btn-primary" id="btn-check-sorting" onclick="DragDropEngine.checkAnswers()">Check Answers</button></div>';
    html += '<div id="sorting-results" style="margin-top: 16px;"></div>';
    return html;
  }

  function renderSorting(lesson) {
    let html = `<div class="info-box"><div class="info-box-title">Sorting Activity</div><p>${lesson.instruction || 'Drag the items into the correct order.'}</p></div>`;
    html += '<div class="sorting-activity">';
    html += '<div class="sorting-list" id="sorting-list">';
    const shuffled = [...lesson.items].sort(() => Math.random() - 0.5);
    shuffled.forEach((item, idx) => {
      html += `<div class="sorting-item" draggable="true" data-id="${item.id}" data-correct="${item.correct}">
        <div class="sort-handle">⠿</div>
        <div class="sort-number">${idx + 1}</div>
        <div class="sort-text">${item.text}</div>
      </div>`;
    });
    html += '</div>';
    html += '<div style="text-align: center; margin-top: 16px;"><button class="btn btn-primary" onclick="checkSorting()">Check Order</button></div>';
    html += '<div id="sorting-results" style="margin-top: 16px;"></div>';
    html += '</div>';
    return html;
  }

  function renderConfidence(lesson) {
    const id = lesson.id;
    let html = `<div class="confidence-block" id="${id}-confidence">`;
    html += `<div class="confidence-question">${lesson.question}</div>`;
    html += `<div class="confidence-level-display" id="${id}-level">3</div>`;
    html += `<div class="confidence-slider-container">`;
    html += `<input type="range" class="confidence-slider" id="${id}-slider" min="1" max="5" value="3" oninput="updateConfidenceLevel('${id}', this.value)">`;
    html += `<div class="confidence-labels"><span>Not Confident</span><span>Moderate</span><span>Very Confident</span></div>`;
    html += `</div>`;
    html += `<button class="btn btn-primary" onclick="checkConfidence('${id}')">Reveal Answer</button>`;
    html += `<div class="confidence-feedback" id="${id}-feedback"></div>`;
    html += `</div>`;
    return html;
  }

  function initSorting(lesson) {
    const list = document.getElementById('sorting-list');
    if (!list) return;
    let draggedItem = null;

    list.querySelectorAll('.sorting-item').forEach(item => {
      item.addEventListener('dragstart', (e) => {
        draggedItem = item;
        item.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      });

      item.addEventListener('dragend', () => {
        item.classList.remove('dragging');
        draggedItem = null;
        updateSortNumbers();
      });

      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      });

      item.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedItem && draggedItem !== item) {
          const rect = item.getBoundingClientRect();
          const midY = rect.top + rect.height / 2;
          if (e.clientY < midY) {
            list.insertBefore(draggedItem, item);
          } else {
            list.insertBefore(draggedItem, item.nextSibling);
          }
          updateSortNumbers();
        }
      });
    });
  }

  function updateSortNumbers() {
    const list = document.getElementById('sorting-list');
    if (!list) return;
    list.querySelectorAll('.sorting-item').forEach((item, idx) => {
      item.querySelector('.sort-number').textContent = idx + 1;
    });
  }

  window.checkSorting = function() {
    const list = document.getElementById('sorting-list');
    if (!list) return;
    const items = list.querySelectorAll('.sorting-item');
    let correct = 0;
    const total = items.length;

    items.forEach((item, idx) => {
      item.classList.remove('correct', 'incorrect');
      const correctIdx = parseInt(item.dataset.correct);
      if (idx === correctIdx) {
        item.classList.add('correct');
        correct++;
      } else {
        item.classList.add('incorrect');
      }
      item.setAttribute('draggable', 'false');
      item.style.cursor = 'default';
    });

    const pct = Math.round((correct / total) * 100);
    const passed = pct >= 70;
    state.scores['hazard-sorting-order'] = { score: pct, passed };
    state.completedLessons.add(`${state.currentSection}-${state.currentLesson}`);
    saveSuspendData();
    renderSidebar();
    updateProgress();

    document.getElementById('sorting-results').innerHTML =
      `<div class="info-box"><div class="info-box-title">${passed ? 'Activity Complete!' : 'Try Again'}</div><p>Score: ${correct}/${total} in correct position (${pct}%)</p>
      <button class="btn btn-primary" onclick="retrySorting()" style="margin-top:8px;">Try Again</button></div>`;
  };

  window.retrySorting = function() {
    const section = sections[state.currentSection];
    const lesson = section.lessons[state.currentLesson];
    document.getElementById('content').innerHTML = renderSorting(lesson);
    initSorting(lesson);
    document.getElementById('content').scrollTop = 0;
  };

  window.updateConfidenceLevel = function(id, val) {
    const display = document.getElementById(id + '-level');
    if (display) display.textContent = val;
    const labels = ['', 'Not Confident', 'Slightly Confident', 'Moderate', 'Confident', 'Very Confident'];
    display.textContent = `${val} — ${labels[val] || ''}`;
  };

  window.checkConfidence = function(blockId) {
    const block = document.getElementById(blockId + '-confidence');
    const slider = document.getElementById(blockId + '-slider');
    const feedback = document.getElementById(blockId + '-feedback');
    const btn = block.querySelector('.btn-primary');
    if (!slider || !feedback) return;

    const level = parseInt(slider.value);
    btn.disabled = true;
    btn.style.opacity = '0.6';
    btn.style.cursor = 'default';
    slider.disabled = true;

    const section = sections[state.currentSection];
    const lesson = section.lessons[state.currentLesson];

    const levels = ['', 'Not Confident', 'Slightly Confident', 'Moderate', 'Confident', 'Very Confident'];
    const confidenceText = levels[level];

    let msg = lesson.feedback || lesson.answer;
    let isCorrect = lesson.answerIsCorrect !== undefined ? lesson.answerIsCorrect : true;

    feedback.innerHTML = `
      <div style="font-weight:600;margin-bottom:8px;">Your confidence: ${confidenceText} (${level}/5)</div>
      <div style="font-size:15px;line-height:1.6;">${msg}</div>
    `;
    feedback.className = 'confidence-feedback show ' + (isCorrect ? 'correct' : 'incorrect');

    state.completedLessons.add(`${state.currentSection}-${state.currentLesson}`);
    saveSuspendData();
    renderSidebar();
    updateProgress();
  };

  function initQuiz(lesson) {
    window.QuizEngine = {
      answers: new Map(),
      submitted: false,

      selectOption(qi, oi) {
        if (this.submitted) return;
        this.answers.set(qi, oi);
        const options = document.querySelectorAll(`[data-question="${qi}"]`);
        options.forEach(o => { o.classList.remove('selected'); o.setAttribute('aria-checked', 'false'); });
        options[oi].classList.add('selected');
        options[oi].setAttribute('aria-checked', 'true');
        this.checkAllAnswered();
      },

      selectTF(qi, value) {
        if (this.submitted) return;
        this.answers.set(qi, value);
        const btns = document.querySelectorAll(`[data-question="${qi}"]`);
        btns.forEach(b => b.classList.remove('selected'));
        const selected = document.querySelector(`[data-question="${qi}"][data-value="${value}"]`);
        if (selected) selected.classList.add('selected');
        this.checkAllAnswered();
      },

      checkFillBlank() {
        let allFilled = true;
        lesson.questions.forEach((q, i) => {
          if (q.type === 'fill-blank') {
            const input = document.getElementById(`blank-${i}`);
            if (input && input.value.trim() === '') allFilled = false;
          }
        });
        // For non-fill-blank questions, check if they have answers
        let nonBlankAnswered = true;
        lesson.questions.forEach((q, i) => {
          if (q.type !== 'fill-blank' && q.type !== 'matching' && !this.answers.has(i)) {
            nonBlankAnswered = false;
          }
        });
        document.getElementById('btn-submit-quiz').disabled = !(allFilled && nonBlankAnswered && this.checkMatching());
      },

      checkMatching() {
        let allSelected = true;
        lesson.questions.forEach((q, i) => {
          if (q.type === 'matching') {
            q.pairs.forEach((pair, pi) => {
              const sel = document.getElementById(`match-select-${i}-${pi}`);
              if (sel && sel.value === '') allSelected = false;
            });
          }
        });
        return allSelected;
      },

      checkAllAnswered() {
        let count = 0;
        lesson.questions.forEach((q, i) => {
          if (q.type === 'fill-blank') {
            const input = document.getElementById(`blank-${i}`);
            if (input && input.value.trim() !== '') count++;
          } else if (q.type === 'matching') {
            if (this.checkMatching()) count++;
          } else if (this.answers.has(i)) {
            count++;
          }
        });
        document.getElementById('btn-submit-quiz').disabled = (count < lesson.questions.length);
      },

      submitQuiz() {
        if (this.submitted) return;

        // Collect all answers before checking
        lesson.questions.forEach((q, i) => {
          if (q.type === 'fill-blank') {
            const input = document.getElementById(`blank-${i}`);
            if (input) this.answers.set(i, input.value.trim());
          }
        });

        let totalAnswered = 0;
        lesson.questions.forEach((q, i) => {
          if (q.type === 'matching') {
            let allMatched = true;
            q.pairs.forEach((pair, pi) => {
              const sel = document.getElementById(`match-select-${i}-${pi}`);
              if (!sel || sel.value === '') allMatched = false;
            });
            if (allMatched) totalAnswered++;
          } else if (this.answers.has(i)) {
            totalAnswered++;
          }
        });
        if (totalAnswered < lesson.questions.length) return;

        if (lesson.type === 'assessment') {
          state.quizAttempts[lesson.id] = (state.quizAttempts[lesson.id] || 0) + 1;
          saveSuspendData();
        }

        let correct = 0;
        lesson.questions.forEach((q, i) => {
          const userAnswer = this.answers.get(i);

          if (q.type === 'true-false') {
            const btns = document.querySelectorAll(`[data-question="${i}"]`);
            btns.forEach(b => { b.classList.remove('selected'); b.style.pointerEvents = 'none'; });
            if (userAnswer === q.correct) {
              const correctBtn = document.querySelector(`[data-question="${i}"][data-value="${q.correct}"]`);
              if (correctBtn) correctBtn.classList.add('correct');
              correct++;
            } else {
              if (userAnswer !== undefined) {
                const userBtn = document.querySelector(`[data-question="${i}"][data-value="${userAnswer}"]`);
                if (userBtn) userBtn.classList.add('incorrect');
              }
              const correctBtn = document.querySelector(`[data-question="${i}"][data-value="${q.correct}"]`);
              if (correctBtn) correctBtn.classList.add('correct');
            }
          } else if (q.type === 'fill-blank') {
            const input = document.getElementById(`blank-${i}`);
            if (input) {
              input.disabled = true;
              const isCorrect = input.value.trim().toLowerCase() === q.answer.toLowerCase();
              input.classList.add(isCorrect ? 'correct' : 'incorrect');
              if (isCorrect) correct++;
            }
          } else if (q.type === 'matching') {
            let allCorrect = true;
            q.pairs.forEach((pair, pi) => {
              const sel = document.getElementById(`match-select-${i}-${pi}`);
              if (sel) {
                sel.disabled = true;
                if (sel.value === pair.match) {
                  sel.classList.add('correct');
                } else {
                  sel.classList.add('incorrect');
                  allCorrect = false;
                }
              }
            });
            if (allCorrect) correct++;
          } else {
            const options = document.querySelectorAll(`[data-question="${i}"]`);
            options.forEach(o => { o.classList.remove('selected'); o.style.pointerEvents = 'none'; });
            if (userAnswer === q.correct) {
              options[userAnswer].classList.add('correct');
              correct++;
            } else {
              if (userAnswer !== undefined) options[userAnswer].classList.add('incorrect');
              options[q.correct].classList.add('correct');
            }
            // Per-option feedback for MC — show only for selected and correct answers
            if (q.optionFeedback) {
              q.options.forEach((opt, j) => {
                const fbEl = document.getElementById(`opt-fb-${i}-${j}`);
                if (fbEl && q.optionFeedback[j] && (j === userAnswer || j === q.correct)) {
                  fbEl.textContent = q.optionFeedback[j];
                  fbEl.classList.add('visible');
                  if (j === q.correct) fbEl.classList.add('correct-feedback');
                  else fbEl.classList.add('incorrect-feedback');
                }
              });
            }
          }

          let feedbackText = '';
          if (q.type === 'true-false') {
            feedbackText = (userAnswer === q.correct) ? '✓ Correct!' : '✗ Incorrect';
          } else if (q.type === 'fill-blank') {
            const input = document.getElementById(`blank-${i}`);
            feedbackText = (input && input.value.trim().toLowerCase() === q.answer.toLowerCase()) ? '✓ Correct!' : `✗ Incorrect. Correct answer: ${q.answer}`;
          } else if (q.type === 'matching') {
            const isCorrect = q.pairs.every((pair, pi) => {
              const sel = document.getElementById(`match-select-${i}-${pi}`);
              return sel && sel.value === pair.match;
            });
            feedbackText = isCorrect ? '✓ Correct!' : '✗ Incorrect';
          } else {
            feedbackText = (userAnswer === q.correct) ? '✓ Correct!' : '✗ Incorrect';
          }

          document.getElementById(`feedback${i}`).innerHTML =
            `<div class="quiz-feedback-text">${feedbackText} ${q.explanation || ''}</div>`;
        });

        this.submitted = true;
        document.getElementById('btn-submit-quiz').style.display = 'none';

        const pct = Math.round((correct / lesson.questions.length) * 100);
        const passed = pct >= (lesson.passScore || 70);

        state.scores[lesson.id] = { score: pct, passed, correct, total: lesson.questions.length, date: new Date().toISOString() };
        SCORMWrapper.setScore(pct);
        SCORMWrapper.setInteraction(lesson.id, 'scored', pct, lesson.questions.length);

        if (lesson.type === 'assessment') {
          SCORMWrapper.setSuccess(passed);
          SCORMWrapper.setCompletion(true);
        }

        state.completedLessons.add(`${state.currentSection}-${state.currentLesson}`);
        saveSuspendData();
        renderSidebar();
        updateProgress();

        let resultHtml = `<div class="quiz-results-box ${passed ? 'quiz-pass' : 'quiz-fail'}">`;
        resultHtml += `<h3>${passed ? 'Congratulations! You Passed!' : 'Not Quite'}</h3>`;
        resultHtml += `<p>Score: <strong>${correct}/${lesson.questions.length}</strong> (${pct}%)</p>`;
        if (lesson.passScore) resultHtml += `<p>Required: ${lesson.passScore}%</p>`;
        resultHtml += `<button class="btn btn-primary" onclick="QuizEngine.retryQuiz()">Try Again</button>`;
        if (lesson.type === 'assessment') {
          const remaining = Math.max(0, state.maxAttempts - (state.quizAttempts[lesson.id] || 0));
          if (remaining > 0) {
            resultHtml += `<p style="margin-top:8px;">Attempts remaining: ${remaining}</p>`;
          } else {
            resultHtml += `<p style="margin-top:8px; color:#d32f2f;">No attempts remaining. Please contact your administrator.</p>`;
          }
        }
        if (passed && isCourseComplete()) {
          resultHtml += `<div style="margin-top: 16px; padding: 16px; background: #e8f5e9; border-radius: 8px; border: 1px solid #4caf50;">
            <p style="margin: 0 0 12px; font-weight: 600; color: #2e7d32;">You have completed all assessments!</p>
            <button class="btn btn-primary" onclick="showCertificate()" style="background: #1a237e;">View Your Certificate</button>
          </div>`;
        }
        resultHtml += '</div>';
        document.getElementById('quiz-results').innerHTML = resultHtml;
        document.getElementById('quiz-results').style.display = 'block';
      },

      retryQuiz() {
        this.answers.clear();
        this.submitted = false;
        const section = sections[state.currentSection];
        const lesson = section.lessons[state.currentLesson];
        document.getElementById('content').innerHTML = renderQuiz(lesson);
        initQuiz(lesson);
        document.getElementById('content').scrollTop = 0;
      }
    };
  }

  function initDragDrop(lesson) {
    const items = document.querySelectorAll('.drag-item');
    const zones = document.querySelectorAll('.drop-zone');
    const dragPool = document.getElementById('drag-items');

    items.forEach(item => {
      item.addEventListener('dragstart', e => {
        state.draggedItem = item;
        item.style.opacity = '0.4';
        e.dataTransfer.effectAllowed = 'move';
      });
      item.addEventListener('dragend', () => {
        item.style.opacity = '1';
        state.draggedItem = null;
      });
    });

    // Make drop zones accept items
    zones.forEach(zone => {
      zone.addEventListener('dragover', e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        zone.classList.add('drag-over');
      });
      zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));
      zone.addEventListener('drop', e => {
        e.preventDefault();
        zone.classList.remove('drag-over');
        if (state.draggedItem) {
          zone.appendChild(state.draggedItem);
          state.draggedItem.classList.remove('correct', 'incorrect');
          state.draggedItem = null;
        }
      });
    });

    // Make the drag pool also accept drops (return items to pool)
    if (dragPool) {
      dragPool.addEventListener('dragover', e => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        dragPool.classList.add('drag-over');
      });
      dragPool.addEventListener('dragleave', () => dragPool.classList.remove('drag-over'));
      dragPool.addEventListener('drop', e => {
        e.preventDefault();
        dragPool.classList.remove('drag-over');
        if (state.draggedItem) {
          dragPool.appendChild(state.draggedItem);
          state.draggedItem.classList.remove('correct', 'incorrect');
          state.draggedItem = null;
        }
      });
    }
  }

  /* ─── Accordion Component ─── */
  function initAccordions() {
    document.querySelectorAll('.accordion-header').forEach(header => {
      header.setAttribute('tabindex', '0');
      header.setAttribute('role', 'button');
      header.setAttribute('aria-expanded', 'false');

      const toggle = () => {
        const item = header.parentElement;
        const isOpen = item.classList.contains('open');
        item.classList.toggle('open');
        header.setAttribute('aria-expanded', !isOpen);
      };

      header.addEventListener('click', toggle);
      header.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggle();
        }
      });
    });
  }

  /* ─── Tabs Component ─── */
  function initTabs() {
    document.querySelectorAll('.tabs-container').forEach(container => {
      const headers = container.querySelectorAll('.tabs-header .tab-btn');
      const panels = container.querySelectorAll('.tabs-body .tab-panel');

      headers.forEach((tab, index) => {
        tab.setAttribute('tabindex', index === 0 ? '0' : '-1');
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
        tab.setAttribute('aria-controls', `tab-panel-${index}`);
        if (panels[index]) panels[index].setAttribute('id', `tab-panel-${index}`);

        tab.addEventListener('click', () => {
          headers.forEach(h => { h.classList.remove('active'); h.setAttribute('aria-selected', 'false'); h.setAttribute('tabindex', '-1'); });
          panels.forEach(p => p.classList.remove('active'));
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');
          tab.setAttribute('tabindex', '0');
          if (panels[index]) panels[index].classList.add('active');
        });

        tab.addEventListener('keydown', (e) => {
          let newIndex = index;
          if (e.key === 'ArrowRight') newIndex = (index + 1) % headers.length;
          else if (e.key === 'ArrowLeft') newIndex = (index - 1 + headers.length) % headers.length;
          else return;
          e.preventDefault();
          headers[newIndex].click();
          headers[newIndex].focus();
        });
      });
    });
  }

  /* ─── Timeline Component ─── */
  function initTimelines() {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateX(0)';
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.timeline-item').forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateX(-20px)';
      item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
      observer.observe(item);
    });
  }

  function initHotspots() {
    document.querySelectorAll('.hotspot').forEach(spot => {
      const tooltip = spot.querySelector('.hotspot-tooltip');
      if (!tooltip) return;

      const positionTooltip = () => {
        const parent = spot.closest('.labeled-graphic') || spot.parentElement;
        const parentRect = parent.getBoundingClientRect();
        const spotRect = spot.getBoundingClientRect();
        const tooltipW = 260;
        const margin = 8;

        const relativeTop = spotRect.top - parentRect.top;
        const relativeLeft = spotRect.left - parentRect.left;

        let top, left, arrowPos;

        if (relativeTop > tooltipW + margin + 40) {
          top = relativeTop - tooltipW - margin;
          arrowPos = 'bottom';
        } else {
          top = relativeTop + spotRect.height + margin;
          arrowPos = 'top';
        }

        left = relativeLeft - (tooltipW - spotRect.width) / 2;
        if (left < 0) left = 0;
        if (left + tooltipW > parentRect.width) left = parentRect.width - tooltipW;

        tooltip.style.top = (top - relativeTop) + 'px';
        tooltip.style.left = (left - relativeLeft) + 'px';
        tooltip.dataset.pos = arrowPos;
      };

      const showTooltip = () => {
        document.querySelectorAll('.hotspot').forEach(s => { s.style.zIndex = '1'; });
        tooltip.style.display = 'block';
        tooltip.style.opacity = '1';
        spot.style.zIndex = '100';
        positionTooltip();
        spot.setAttribute('aria-expanded', 'true');
      };
      const hideTooltip = () => {
        tooltip.style.display = 'none';
        tooltip.style.opacity = '0';
        spot.style.zIndex = '';
        document.querySelectorAll('.hotspot').forEach(s => { s.style.zIndex = ''; });
        spot.setAttribute('aria-expanded', 'false');
      };

      spot.addEventListener('click', (e) => {
        e.stopPropagation();
        const isVisible = tooltip.style.display === 'block';
        document.querySelectorAll('.hotspot-tooltip').forEach(t => { t.style.display = 'none'; t.style.opacity = '0'; });
        document.querySelectorAll('.hotspot').forEach(s => { s.style.zIndex = ''; });
        if (!isVisible) showTooltip();
      });
      spot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); spot.click(); }
        if (e.key === 'Escape') hideTooltip();
      });
      spot.setAttribute('aria-expanded', 'false');
      spot.setAttribute('tabindex', '0');
    });
    document.addEventListener('click', () => {
      document.querySelectorAll('.hotspot-tooltip').forEach(t => { t.style.display = 'none'; t.style.opacity = '0'; });
      document.querySelectorAll('.hotspot').forEach(s => { s.style.zIndex = ''; });
    });
  }

  function initFlashcards() {
    document.querySelectorAll('.flashcard-container').forEach(container => {
      const cards = container.querySelectorAll('.flashcard');
      const progressEl = container.querySelector('.flashcard-progress');
      const prevBtn = container.querySelector('[data-action="prev"]');
      const nextBtn = container.querySelector('[data-action="next"]');
      let current = 0;
      const total = cards.length;

      function showCard(idx) {
        cards.forEach((c, i) => {
          c.classList.toggle('active', i === idx);
          const face = c.querySelector('.flashcard-face');
          if (face) face.style.transform = 'rotateY(0deg)';
        });
        if (progressEl) progressEl.textContent = `${idx + 1} / ${total}`;
      }

      if (prevBtn) prevBtn.onclick = () => { current = (current - 1 + total) % total; showCard(current); };
      if (nextBtn) nextBtn.onclick = () => { current = (current + 1) % total; showCard(current); };

      cards.forEach(card => {
        const face = card.querySelector('.flashcard-face');
        if (!face) return;
        card.addEventListener('click', () => {
          const isFlipped = face.style.transform === 'rotateY(180deg)';
          face.style.transform = isFlipped ? 'rotateY(0deg)' : 'rotateY(180deg)';
        });
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', 'Click to flip card');
        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
        });
      });

      showCard(0);
    });
  }

  function initScenarios() {
    document.querySelectorAll('.scenario-container').forEach(container => {
      const data = JSON.parse(container.dataset.scenario || '{}');
      if (!data.nodes) return;

      const narrativeEl = container.querySelector('.scenario-narrative');
      const choicesEl = container.querySelector('.scenario-choices');
      const feedbackEl = container.querySelector('.scenario-feedback');
      const scoreEl = container.querySelector('.scenario-score');
      const headerEl = container.querySelector('.scenario-header');

      let currentNode = data.start || 'start';
      let score = 0;
      let decisions = [];
      let visited = new Set();

      function renderNode(nodeId) {
        const node = data.nodes[nodeId];
        if (!node) return;
        visited.add(nodeId);
        currentNode = nodeId;

        if (node.end) {
          if (narrativeEl) narrativeEl.innerHTML = `<p>${node.text}</p>`;
          if (choicesEl) choicesEl.innerHTML = '';
          if (feedbackEl) { feedbackEl.innerHTML = ''; feedbackEl.className = 'scenario-feedback'; }
          if (scoreEl) {
            const pct = Math.round((score / Math.max(1, decisions.length)) * 100);
            scoreEl.innerHTML = `
              <div class="scenario-score">Scenario Complete! Score: ${score}/${decisions.length} correct (${pct}%)</div>
              <div style="display:flex;gap:12px;margin-top:16px;justify-content:center;">
                <button class="nav-btn secondary" onclick="initScenarios()">Try Again</button>
                <button class="nav-btn primary" onclick="navigateNext()">Next →</button>
              </div>`;
          }
          if (headerEl) headerEl.innerHTML = '<h3>Scenario Complete</h3>';
          return;
        }

        if (narrativeEl) narrativeEl.innerHTML = `<p>${node.text}</p>`;
        if (feedbackEl) { feedbackEl.innerHTML = ''; feedbackEl.className = 'scenario-feedback'; }
        if (scoreEl) scoreEl.innerHTML = '';

        if (choicesEl && node.choices) {
          choicesEl.innerHTML = node.choices.map((ch, ci) =>
            `<div class="scenario-choice" data-choice="${ci}" role="button" tabindex="0" aria-label="${ch.text}">${ch.text}</div>`
          ).join('');

          choicesEl.querySelectorAll('.scenario-choice').forEach(el => {
            const handler = () => {
              const ci = parseInt(el.dataset.choice);
              const choice = node.choices[ci];
              decisions.push({ nodeId, choice: ci, correct: choice.correct });

              choicesEl.querySelectorAll('.scenario-choice').forEach(c => {
                c.classList.add('disabled');
                c.classList.remove('selected');
                if (c !== el) c.style.display = 'none';
              });
              el.classList.add('selected');

              if (choice.correct) {
                el.classList.add('correct');
                score++;
                if (feedbackEl) {
                  feedbackEl.innerHTML = choice.feedback || 'Correct!';
                  feedbackEl.className = 'scenario-feedback visible correct';
                }
              } else {
                el.classList.add('incorrect');
                if (feedbackEl) {
                  feedbackEl.innerHTML = choice.feedback || 'Incorrect.';
                  feedbackEl.className = 'scenario-feedback visible incorrect';
                }
              }

              setTimeout(() => {
                if (choice.next) renderNode(choice.next);
              }, 1500);
            };
            el.addEventListener('click', handler);
            el.addEventListener('keydown', (e) => {
              if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); }
            });
          });
        }
      }

      renderNode(currentNode);
    });
  }

  window.submitIncidentReport = function() {
    const fields = document.querySelectorAll('.ir-field');
    let filled = 0;
    fields.forEach(f => { if (f.value.trim()) filled++; });
    const total = fields.length;
    const pct = Math.round((filled / total) * 100);
    const passed = filled >= 6;
    const fb = document.getElementById('ir-feedback');
    if (fb) {
      fb.style.display = 'block';
      fb.className = passed ? 'info-box' : 'info-box';
      fb.innerHTML = `<div class="info-box-title" style="color:${passed ? '#4caf50' : '#ff9800'}">${passed ? '✓ Report Complete!' : '⚠ Incomplete Report'}</div><p style="margin:8px 0;">You filled in ${filled}/${total} fields (${pct}%). ${passed ? 'This is a well-documented incident report.' : 'Please complete all fields for a thorough report. Missing information weakens the investigation.'}</p><p style="font-size:13px;color:#8892a4;">Tip: A good incident report answers Who, What, When, Where, Why, and How.</p>`;
    }
    if (passed) {
      state.completedLessons.add(`${state.currentSection}-${state.currentLesson}`);
      saveSuspendData();
      renderSidebar();
      updateProgress();
    }
  };

  function initGalleries() {
    document.querySelectorAll('.image-gallery').forEach(gallery => {
      const mainImg = gallery.querySelector('.gallery-main img');
      const captionEl = gallery.querySelector('.gallery-caption');
      const thumbs = gallery.querySelectorAll('.gallery-thumb');
      if (!mainImg || thumbs.length === 0) return;

      thumbs.forEach(thumb => {
        thumb.addEventListener('click', () => {
          mainImg.src = thumb.dataset.src || thumb.src;
          mainImg.alt = thumb.alt || '';
          if (captionEl) captionEl.textContent = thumb.alt || '';
          thumbs.forEach(t => t.classList.remove('active'));
          thumb.classList.add('active');
        });
        thumb.setAttribute('tabindex', '0');
        thumb.setAttribute('role', 'button');
        thumb.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); thumb.click(); }
        });
      });
    });
  }

  window.DragDropEngine = {
    checkAnswers() {
      let correct = 0;
      const total = document.querySelectorAll('.drag-item').length;
      document.querySelectorAll('.drop-zone').forEach(zone => {
        const zoneId = zone.dataset.zone;
        zone.querySelectorAll('.drag-item').forEach(item => {
          if (item.dataset.correct === zoneId) {
            item.classList.add('correct');
            correct++;
          } else {
            item.classList.add('incorrect');
          }
        });
      });

      const pct = Math.round((correct / total) * 100);
      const passed = pct >= 70;
      state.scores['hazard-sorting'] = { score: pct, passed };
      state.completedLessons.add(`${state.currentSection}-${state.currentLesson}`);
      saveSuspendData();
      renderSidebar();
      updateProgress();

      document.getElementById('sorting-results').innerHTML =
        `<div class="info-box"><div class="info-box-title">${passed ? 'Activity Complete!' : 'Try Again'}</div><p>Score: ${correct}/${total} (${pct}%)</p>
        <button class="btn btn-primary" onclick="DragDropEngine.retryDragDrop()" style="margin-top:8px;">Try Again</button></div>`;
    },

    retryDragDrop() {
      const section = sections[state.currentSection];
      const lesson = section.lessons[state.currentLesson];
      document.getElementById('content').innerHTML = renderDragDrop(lesson);
      initDragDrop(lesson);
      document.getElementById('content').scrollTop = 0;
    }
  };

  function navigateTo(si, li) {
    si = parseInt(si, 10);
    li = parseInt(li, 10);
    if (isNaN(si) || isNaN(li) || si < 0 || li < 0) return;
    // Auto-close sidebar on mobile
    if (window.innerWidth <= 1023) {
      const sidebar = document.getElementById('sidebar');
      if (sidebar && !sidebar.classList.contains('collapsed')) {
        window.toggleSidebar();
      }
    }
    if (!isLessonAccessible(si, li)) {
      // Show locked overlay for the section the user tried to access
      state.currentSection = si;
      state.currentLesson = li;
      saveSuspendData();
      renderSidebar();
      renderContent();
      return;
    }
    state.currentSection = si;
    state.currentLesson = li;
    saveSuspendData();
    renderSidebar();
    renderContent();
  }

  window.navigateTo = navigateTo;
  window.initScenarios = initScenarios;

  window.navigateNext = function() {
    const section = sections[state.currentSection];
    if (state.currentLesson < section.lessons.length - 1) {
      const nextLi = state.currentLesson + 1;
      if (isLessonAccessible(state.currentSection, nextLi)) {
        state.currentLesson = nextLi;
      } else {
        // Quiz within section is locked - stop here
        return;
      }
    } else if (state.currentSection < sections.length - 1) {
      const nextSi = state.currentSection + 1;
      if (isLessonAccessible(nextSi, 0)) {
        state.currentSection = nextSi;
        state.currentLesson = 0;
      } else {
        // Next section is locked
        return;
      }
    }
    saveSuspendData();
    renderSidebar();
    renderContent();
  };

  window.navigatePrev = function() {
    if (state.currentLesson > 0) {
      state.currentLesson--;
    } else if (state.currentSection > 0) {
      state.currentSection--;
      state.currentLesson = sections[state.currentSection].lessons.length - 1;
    }
    saveSuspendData();
    renderSidebar();
    renderContent();
  };

  function updateProgress() {
    const total = sections.reduce((acc, s) => acc + s.lessons.length, 0);
    const completed = state.completedLessons.size;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
    // Update bottom bar
    const prog = document.getElementById('lesson-progress');
    if (prog) prog.textContent = `${completed}/${total} lessons completed (${pct}%)`;
    // Update sidebar progress text and bar
    const progressText = document.getElementById('progress-text');
    if (progressText) progressText.textContent = `${pct}% Complete`;
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) progressFill.style.width = `${pct}%`;
    SCORMWrapper.setCompletion(pct >= 100);
  }

  // Sidebar toggle
  window.toggleSidebar = function() {
    const sidebar = document.getElementById('sidebar');
    const toggle = document.getElementById('sidebar-toggle');
    const toggleWrap = document.getElementById('sidebar-toggle-wrap');
    const isMobile = window.innerWidth <= 1023;
    sidebar.classList.toggle('collapsed');
    const isCollapsed = sidebar.classList.contains('collapsed');
    toggle.textContent = isCollapsed ? '☰' : '✕';
    if (isMobile) {
      toggleWrap.style.left = isCollapsed ? '0px' : '260px';
      if (!isCollapsed) {
        // Open: add backdrop
        let bd = document.getElementById('sidebar-backdrop');
        if (!bd) {
          bd = document.createElement('div');
          bd.id = 'sidebar-backdrop';
          bd.className = 'sidebar-backdrop';
          bd.addEventListener('click', function() { window.toggleSidebar(); });
          document.body.appendChild(bd);
        }
      } else {
        // Closed: remove backdrop
        const bd = document.getElementById('sidebar-backdrop');
        if (bd) bd.remove();
      }
    } else {
      toggleWrap.style.left = isCollapsed ? '0px' : '280px';
    }
  };

  // Statement block (Agree/Disagree)
  window.checkStatement = function(blockId, answered, isCorrect, correctMsg, incorrectMsg) {
    const block = document.getElementById(blockId);
    if (!block) return;
    const feedback = document.getElementById(blockId + '-feedback');
    const btns = block.querySelectorAll('.statement-btn');

    btns.forEach(btn => {
      btn.disabled = true;
      btn.style.opacity = '0.6';
      btn.style.cursor = 'default';
    });

    const defaultCorrect = '✓ Correct!';
    const defaultIncorrect = '✗ Actually, that\'s not quite right.';

    if (isCorrect) {
      event.target.classList.add('selected');
      feedback.textContent = correctMsg || defaultCorrect;
      feedback.className = 'statement-feedback show correct';
    } else {
      event.target.classList.add('selected');
      feedback.textContent = incorrectMsg || defaultIncorrect;
      feedback.className = 'statement-feedback show incorrect';
    }
  };

  // Tabs block
  window.switchTab = function(groupId, index) {
    const nav = document.getElementById(groupId + '-nav');
    if (!nav) return;
    const btns = nav.querySelectorAll('.tab-btn');
    btns.forEach((btn, i) => {
      btn.classList.toggle('active', i === index);
      const panel = document.getElementById(groupId + '-' + i);
      if (panel) panel.classList.toggle('active', i === index);
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Handle resize: collapse/expand sidebar at breakpoint
  let lastWidth = window.innerWidth;
  window.addEventListener('resize', function() {
    const sidebar = document.getElementById('sidebar');
    const toggleWrap = document.getElementById('sidebar-toggle-wrap');
    if (!sidebar || !toggleWrap) return;
    const now = window.innerWidth;
    const crossed = (lastWidth <= 1023 && now > 1023) || (lastWidth > 1023 && now <= 1023);
    if (crossed) {
      if (now <= 1023) {
        // Entering mobile: collapse sidebar, remove backdrop
        sidebar.classList.add('collapsed');
        const bd = document.getElementById('sidebar-backdrop');
        if (bd) bd.remove();
        toggleWrap.style.left = '0px';
      } else {
        // Entering desktop: expand sidebar, remove backdrop
        sidebar.classList.remove('collapsed');
        const bd = document.getElementById('sidebar-backdrop');
        if (bd) bd.remove();
        toggleWrap.style.left = '280px';
      }
    }
    lastWidth = now;
  });
})();
