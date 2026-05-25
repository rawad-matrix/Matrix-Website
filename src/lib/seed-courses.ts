/**
 * seed-courses.ts
 * Run once to wipe the existing courses table and seed it with the
 * full Matrix EA Training Price List 2026.
 *
 * Usage:
 *   npx tsx src/lib/seed-courses.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// ─── Course catalogue from the Training Price List 2026 ────────────────────
// Levels: Basic | Pro | Advanced
// Currency note: Siemens courses are priced in € — stored as numeric, label in short_description.
// Delta / Other courses are priced in $.

const courses = [

  // ────────────────────────────────────────────────────────────────────────
  // SIEMENS SIMATIC S7 COURSES  (prices in €)
  // ────────────────────────────────────────────────────────────────────────
  {
    title: 'Siemens S7-1200 Basic PLC Programming',
    slug: 's7-basic',
    short_description: 'Intro to PLC S7-1200 & ET200S with TIA Portal on real Mechatronics machines. (€200)',
    description: 'Foundation course for the Siemens S7-1200 PLC using TIA Portal. Students work hands-on with a real Mechatronics training station — wiring I/O modules, writing Ladder logic, configuring timers and counters, and running their first automated sequence.',
    level: 'Basic',
    duration_hours: 27,
    price: 200,
    currency: 'EUR',
    category: 'Siemens PLC',
    format: 'Hybrid or F2F – Khaldeh',
    is_published: true,
    outcomes: [
      'Navigate TIA Portal and create a new S7-1200 project',
      'Wire digital and analog I/O modules correctly',
      'Write and debug Ladder Diagram programs',
      'Use timers, counters and comparison instructions',
      'Commission a simple automated machine sequence',
    ],
  },
  {
    title: 'Siemens S7-1200 Pro: HMI, VFD & PID',
    slug: 's7-pro',
    short_description: 'S7-1200 with HMI, Analog Sensors, VFD & PID control on real Mechatronics machines. (€250)',
    description: 'Builds on the Basic course — adds HMI panel development, analog sensor integration, Variable Frequency Drive (VFD) wiring and parameter setting, and closed-loop PID control. All practicals run on real Mechatronics training stations.',
    level: 'Pro',
    duration_hours: 27,
    price: 250,
    currency: 'EUR',
    category: 'Siemens PLC',
    format: 'Hybrid or F2F – Khaldeh',
    is_published: true,
    outcomes: [
      'Design HMI screens and link tags to PLC data blocks',
      'Read and scale 4–20 mA analog signals',
      'Wire a VFD to an S7-1200 and control speed via Modbus',
      'Configure and tune a PID_Compact loop',
      'Troubleshoot a multi-axis Mechatronics system',
    ],
  },
  {
    title: 'Siemens S7 Advanced: 1200 / 1500 / 300 / 400',
    slug: 's7-adv',
    short_description: 'Advanced PLC programming across S7-1200, 1500, 300 & 400 — Analog, VFD, PID. (€300)',
    description: 'Expert-level course spanning the full Siemens S7 family. Covers S7-1500 advanced features, S7-300/400 legacy systems, complex FB/OB structures, PROFINET/PROFIBUS networking, safety PLCs, and industrial project delivery methodology.',
    level: 'Advanced',
    duration_hours: 27,
    price: 300,
    currency: 'EUR',
    category: 'Siemens PLC',
    format: 'Hybrid or F2F – Khaldeh',
    is_published: true,
    outcomes: [
      'Program S7-1500 using OB/FB/FC structure and SCL',
      'Migrate S7-300/400 STEP 7 projects to TIA Portal',
      'Design PROFINET and PROFIBUS DP networks',
      'Implement multi-axis motion with technology objects',
      'Deliver a full industrial PLC project package',
    ],
  },
  {
    title: 'Siemens S7 Bundle: All Levels',
    slug: 's7-bundle',
    short_description: 'Complete Siemens S7 series — Basic, Pro & Advanced combined at bundle price. (€700)',
    description: 'All three Siemens S7 courses (Basic, Pro & Advanced) packaged into one continuous program. The most cost-effective way to go from zero to expert on the full Siemens S7 PLC family.',
    level: 'All',
    duration_hours: 81,
    price: 700,
    currency: 'EUR',
    category: 'Siemens PLC',
    format: 'Hybrid or F2F – Khaldeh',
    is_published: true,
    outcomes: [
      'Complete Siemens S7 mastery from Basic through Advanced',
      'Program S7-1200, S7-1500, S7-300 and S7-400 PLCs',
      'Develop HMI, SCADA and PROFINET systems',
      'Deliver end-to-end industrial automation projects',
    ],
  },
  {
    title: 'Siemens SIMATIC STEP 7 (S7-300 / S7-400)',
    slug: 's7-step7',
    short_description: 'Siemens SIMATIC STEP 7 programming for S7-300 and S7-400 PLCs with SIMATIC Manager. (€200)',
    description: 'Focused course on the classic SIMATIC STEP 7 environment for S7-300 and S7-400 PLCs. Covers SIMATIC Manager project structure, LAD/FBD/STL programming, hardware configuration, online diagnostics, and integration with legacy systems still widely deployed in industry.',
    level: 'Pro',
    duration_hours: 27,
    price: 200,
    currency: 'EUR',
    category: 'Siemens PLC',
    format: 'Hybrid or F2F – Khaldeh',
    is_published: true,
    outcomes: [
      'Create and manage projects in SIMATIC Manager',
      'Program S7-300/400 in LAD, FBD and STL',
      'Configure CP modules and MPI/PROFIBUS networks',
      'Diagnose faults using online tools and diagnostics buffer',
      'Maintain and upgrade legacy S7-300/400 installations',
    ],
  },
  {
    title: 'Siemens PLC Maintenance & Troubleshooting',
    slug: 's7-maint',
    short_description: 'Siemens PLC maintenance, diagnostics and fault-finding for field engineers. (€200)',
    description: 'Practical maintenance course for engineers and technicians who support Siemens PLC systems in the field. Covers preventive maintenance schedules, online monitoring tools, force tables, module replacement, firmware updates, and structured fault-finding methodology.',
    level: 'Pro',
    duration_hours: 27,
    price: 200,
    currency: 'EUR',
    category: 'Siemens PLC',
    format: 'Hybrid or F2F – Khaldeh',
    is_published: true,
    outcomes: [
      'Execute a Siemens PLC preventive maintenance schedule',
      'Use TIA Portal online tools: watch tables, force tables, trace',
      'Diagnose CPU and module faults from the diagnostics buffer',
      'Replace CPU, I/O and communication modules safely',
      'Apply systematic fault-finding methodology on live plant',
    ],
  },
  {
    title: 'WinCC SCADA',
    slug: 'scada-wincc',
    short_description: 'Complete Siemens WinCC SCADA — visualization, historian, alarms and reporting. (€900)',
    description: 'Professional WinCC SCADA development course. Students build a full SCADA application from process graphics and dynamic elements through alarm management, historian configuration, report generation, and user security — all integrated with real Siemens PLCs.',
    level: 'Advanced',
    duration_hours: 27,
    price: 900,
    currency: 'EUR',
    category: 'SCADA',
    format: 'Hybrid or F2F – Khaldeh',
    is_published: true,
    outcomes: [
      'Design and configure a WinCC SCADA project from scratch',
      'Build dynamic P&ID-style process graphics',
      'Set up alarm management per ISA-18.2 principles',
      'Configure the WinCC historian and generate reports',
      'Implement user roles and audit trails',
    ],
  },
  {
    title: 'WinCC Flexible: HMI Panels',
    slug: 'scada-winccflex',
    short_description: 'WinCC Flexible for Siemens HMI panels — screen design, tags, alarms and trends. (€550)',
    description: 'Dedicated course on WinCC Flexible for Siemens comfort and basic HMI panels. Covers screen design principles, tag management, alarm configuration, trend displays, recipe management, and panel commissioning on real hardware.',
    level: 'Pro',
    duration_hours: 27,
    price: 550,
    currency: 'EUR',
    category: 'SCADA',
    format: 'Hybrid or F2F – Khaldeh',
    is_published: true,
    outcomes: [
      'Create and download a WinCC Flexible project to a Siemens panel',
      'Design multi-screen HMI navigation with dynamic elements',
      'Configure alarms, trends and recipe views',
      'Link HMI tags to PLC variables via PROFINET/MPI',
      'Commission and test an HMI panel on site',
    ],
  },
  {
    title: 'Siemens Safety: Fail-Safe Systems',
    slug: 'si-failsafe',
    short_description: 'SIMATIC Safety — configuration, programming and diagnostics for fail-safe systems in TIA Portal.',
    description: 'Advanced course covering Siemens Safety Integrated — design and programming of fail-safe PLC systems using F-CPUs and F-modules in TIA Portal. Includes safety program structure, proof-test intervals, SISTEMA assessment, and safety diagnostics.',
    level: 'Advanced',
    duration_hours: 27,
    price: 0,
    currency: 'EUR',
    category: 'Siemens PLC',
    format: 'F2F – Khaldeh',
    is_published: false,
    outcomes: [
      'Understand IEC 62061 / ISO 13849 safety categories',
      'Configure F-CPUs and F-I/O modules in TIA Portal',
      'Write and verify fail-safe Ladder (F-LAD) programs',
      'Perform SISTEMA SIL/PLr assessment for a safety function',
      'Execute proof-test and reset procedures',
    ],
  },
  {
    title: 'Siemens WinAC RTX Soft PLC',
    slug: 'si-softplc',
    short_description: 'Siemens WinAC RTX — programmable soft logic controller running on a standard PC.',
    description: 'Introduces Siemens WinAC RTX, the software PLC solution that runs standard S7 programs on an industrial PC. Covers installation, real-time kernel configuration, PROFIBUS/PROFINET integration, OPC communication, and comparison with hardware PLCs.',
    level: 'Advanced',
    duration_hours: 27,
    price: 0,
    currency: 'EUR',
    category: 'Siemens PLC',
    format: 'F2F – Khaldeh',
    is_published: false,
    outcomes: [
      'Install and configure the WinAC RTX real-time kernel',
      'Load and execute an S7 program on a soft PLC',
      'Connect WinAC to PROFIBUS DP and PROFINET IO networks',
      'Set up OPC DA/UA server communication',
      'Evaluate soft PLC vs. hardware PLC for a given application',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  // SIEMENS SPECIAL CERTIFICATION COURSES  (prices in €)
  // ────────────────────────────────────────────────────────────────────────
  {
    title: 'Professional Automation & Mechatronics Certification',
    slug: 'pam-c',
    short_description: 'Intensive 80-hour professional certification in automation and mechatronics. (€1,800)',
    description: 'A rigorous 80-hour specialist program combining Siemens PLC programming, motion control, pneumatics, hydraulics, and mechatronics systems — leading to the Matrix EA Professional Automation & Mechatronics Certificate. Designed for engineers targeting senior automation roles.',
    level: 'Advanced',
    duration_hours: 80,
    price: 1800,
    currency: 'EUR',
    category: 'Certification',
    format: 'Hybrid or F2F – Specialist',
    is_published: true,
    outcomes: [
      'Program Siemens PLCs at an advanced professional level',
      'Integrate motion, pneumatics and hydraulics subsystems',
      'Commission a full mechatronics production cell',
      'Read and create engineering documentation packages',
      'Achieve the Matrix EA Professional Automation Certificate',
    ],
  },
  {
    title: 'Professional Automation & Robotics Certification',
    slug: 'par-c',
    short_description: 'Intensive 80-hour professional certification in automation and industrial robotics. (€1,800)',
    description: 'An 80-hour specialist program covering advanced PLC automation, industrial robot programming, vision systems, and collaborative robotics — leading to the Matrix EA Professional Automation & Robotics Certificate. Targeted at engineers entering advanced manufacturing and robotics integration.',
    level: 'Advanced',
    duration_hours: 80,
    price: 1800,
    currency: 'EUR',
    category: 'Certification',
    format: 'Hybrid or F2F – Specialist',
    is_published: true,
    outcomes: [
      'Program industrial robots using their native teach pendants',
      'Integrate PLC and robot controllers via digital I/O and OPC UA',
      'Set up a machine vision system for part inspection',
      'Commission a collaborative robot (cobot) application safely',
      'Achieve the Matrix EA Professional Automation & Robotics Certificate',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  // MOTION COURSES  (prices in €)
  // ────────────────────────────────────────────────────────────────────────
  {
    title: 'Siemens Motion Control Basic',
    slug: 'si-motion-basic',
    short_description: 'TIA Portal Motion Control — Pulse & Direction PTO with S7-1200, Stepper Motor & Encoder. (€350)',
    description: 'Entry point into Siemens motion control. Students configure motion technology objects in TIA Portal, wire and tune a stepper motor via Pulse & Direction (PTO) output on an S7-1200, and use encoder feedback for position verification.',
    level: 'Basic',
    duration_hours: 27,
    price: 350,
    currency: 'EUR',
    category: 'Motion',
    format: 'F2F – Expert',
    is_published: true,
    outcomes: [
      'Configure a technology object (TO_Axis) in TIA Portal',
      'Wire a stepper motor driver using Pulse & Direction output',
      'Program MC_MoveAbsolute and MC_MoveRelative blocks',
      'Use encoder feedback for position homing and verification',
      'Diagnose and resolve common stepper motion faults',
    ],
  },
  {
    title: 'Siemens Motion Control Pro',
    slug: 'si-motion-pro',
    short_description: 'Advanced motion with S7-1512C PLC and SINAMICS S110 Servo — single-axis positioning. (€750)',
    description: 'Extends Basic motion training to servo drive technology. Students program a single-axis servo positioning system using the S7-1512C motion CPU and SINAMICS S110 servo drive — covering drive commissioning, gain tuning, electronic cam profiles, and encoder monitoring.',
    level: 'Pro',
    duration_hours: 55,
    price: 750,
    currency: 'EUR',
    category: 'Motion',
    format: 'F2F – Expert',
    is_published: true,
    outcomes: [
      'Commission a SINAMICS S110 servo drive with STARTER / TIA Portal',
      'Tune velocity and position control loops',
      'Program advanced MC blocks: MC_CamIn, MC_PhasingAbsolute',
      'Monitor drive state via PROFINET',
      'Diagnose servo faults and perform safe torque-off (STO)',
    ],
  },
  {
    title: 'Siemens Motion Control Expert',
    slug: 'si-motion-expert',
    short_description: '3-axis synchronized motion and Flying Saw with S7-1512C and SINAMICS S110. (€1,600)',
    description: 'Expert motion course — students implement 3-axis synchronised motion and a Flying Saw application using the S7-1512C motion CPU with multiple SINAMICS S110 drives. Includes virtual master axis, synchronisation objects, cam tables, and high-speed registration.',
    level: 'Advanced',
    duration_hours: 75,
    price: 1600,
    currency: 'EUR',
    category: 'Motion',
    format: 'F2F – Expert',
    is_published: true,
    outcomes: [
      'Configure multi-axis synchronisation with virtual master',
      'Program Flying Saw and Flying Shear applications',
      'Create and load cam tables from CSV data',
      'Implement high-speed registration with hardware interrupt OBs',
      'Commission and tune a 3-axis coordinated motion system',
    ],
  },
  {
    title: 'Siemens CNC: SINAMICS S120 & SIMOTION D435',
    slug: 'si-cnc',
    short_description: 'Siemens SINAMICS S120 4-axis CNC machine control with SIMOTION D435. (€2,450)',
    description: 'Elite CNC commissioning course using the Siemens SIMOTION D435 motion controller and SINAMICS S120 drive system. Students configure a 4-axis CNC machine, program G-code and SCOUT motion sequences, perform axis calibration, and commission the complete CNC cell.',
    level: 'Advanced',
    duration_hours: 75,
    price: 2450,
    currency: 'EUR',
    category: 'Motion',
    format: 'F2F – Expert',
    is_published: true,
    outcomes: [
      'Commission a SINAMICS S120 booksize drive system',
      'Configure the SIMOTION D435 in SIMOTION SCOUT',
      'Write and debug G-code CNC part programs',
      'Perform axis referencing, clamping and geometry calibration',
      'Diagnose CNC and drive alarms using SCOUT diagnostics',
    ],
  },
  {
    title: '3D Printing with Siemens Controls',
    slug: 'si-3d-printing',
    short_description: '3D printing machine integration and control using Siemens PLC and motion systems.',
    description: 'Explores the application of Siemens PLC and motion technology to 3D printer machine control — covering kinematics, extruder control, heated bed management, and Siemens-based motion coordination for FDM/SLA platforms.',
    level: 'Basic',
    duration_hours: 27,
    price: 0,
    currency: 'EUR',
    category: 'Motion',
    format: 'F2F – Khaldeh',
    is_published: false,
    outcomes: [
      'Understand FDM 3D printer kinematics and motion requirements',
      'Configure stepper / servo axes for X, Y, Z and extruder',
      'Program a Siemens PLC to execute G-code move commands',
      'Control heater zones using PID closed-loop control',
      'Integrate end-stops, limit switches, and home sensors',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  // IOT COURSES  (prices in €)
  // ────────────────────────────────────────────────────────────────────────
  {
    title: 'IoT Weather Station',
    slug: 'si-iot-weather',
    short_description: 'Build a water & weather monitoring station using Siemens LOGO! 8 and ESP32. (€90)',
    description: 'Undergraduate-level project course — students build a complete weather and water monitoring station combining the Siemens LOGO! 8 PLC for local control with an ESP32 microcontroller for cloud connectivity and mobile dashboard.',
    level: 'Basic',
    duration_hours: 10,
    price: 90,
    currency: 'EUR',
    category: 'IoT',
    format: 'F2F – Khaldeh',
    is_published: true,
    outcomes: [
      'Program the Siemens LOGO! 8 in LOGO! Soft Comfort',
      'Connect temperature, humidity and rain sensors to LOGO! I/O',
      'Program an ESP32 to read sensor data over serial/I2C',
      'Publish data to an MQTT broker and visualise on a dashboard',
      'Configure LOGO! Web server for local data display',
    ],
  },
  {
    title: 'IoT Home Automation',
    slug: 'si-iot-home',
    short_description: 'Home automation project using Siemens LOGO! 8 and ESP32 controller. (€90)',
    description: 'Undergraduate project — students design and build a smart home automation system using Siemens LOGO! 8 for device switching and scheduling, integrated with an ESP32 for Wi-Fi control via a mobile app or web interface.',
    level: 'Basic',
    duration_hours: 11,
    price: 90,
    currency: 'EUR',
    category: 'IoT',
    format: 'F2F – Khaldeh',
    is_published: true,
    outcomes: [
      'Configure LOGO! 8 for lighting, fans and socket scheduling',
      'Build a mobile-friendly web UI for remote control',
      'Use ESP32 Wi-Fi to send LOGO! commands over Modbus TCP',
      'Implement timed and sensor-triggered automation scenes',
      'Secure the system with basic authentication',
    ],
  },
  {
    title: 'IoT Smart Agriculture',
    slug: 'si-iot-agriculture',
    short_description: 'Smart agriculture project with Siemens LOGO! 8 and ESP32 — sensors, irrigation, monitoring. (€90)',
    description: 'Undergraduate project — students implement a smart agriculture monitoring and irrigation system. LOGO! 8 manages drip irrigation valves and greenhouse ventilation; ESP32 connects soil moisture, temperature, and light sensors to a cloud dashboard.',
    level: 'Basic',
    duration_hours: 12,
    price: 90,
    currency: 'EUR',
    category: 'IoT',
    format: 'F2F – Khaldeh',
    is_published: true,
    outcomes: [
      'Wire soil moisture, temperature and light sensors to LOGO! I/O',
      'Program automated irrigation schedules with threshold logic',
      'Send sensor readings to a cloud database via ESP32 + MQTT',
      'Build a Grafana or Node-RED dashboard for crop monitoring',
      'Configure SMS/email alerts for out-of-range conditions',
    ],
  },
  {
    title: 'IoT Energy Management',
    slug: 'si-iot-energy',
    short_description: 'IoT energy management system using Siemens LOGO! 8 and ESP32 controller. (€90)',
    description: 'Undergraduate project — students build an energy monitoring and load management system. LOGO! 8 controls load switching and demand response; ESP32 reads energy meters over Modbus and publishes consumption data to a cloud dashboard.',
    level: 'Basic',
    duration_hours: 13,
    price: 90,
    currency: 'EUR',
    category: 'IoT',
    format: 'F2F – Khaldeh',
    is_published: true,
    outcomes: [
      'Read a Modbus energy meter from LOGO! 8 / ESP32',
      'Calculate and log kWh consumption per load',
      'Implement demand-response load shedding logic',
      'Display real-time energy data on a cloud dashboard',
      'Generate daily/monthly consumption reports',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  // DELTA COURSES  (prices in $)
  // ────────────────────────────────────────────────────────────────────────
  {
    title: 'Delta PLC Basic',
    slug: 'delta-basic',
    short_description: 'Intro to Delta DVP/AS200 PLC with ISPSoft & DIA Portal on real Mechatronics machines. ($200)',
    description: 'Foundation course for the Delta DVP and AS200 PLC series using ISPSoft and DIA Portal. Students learn I/O wiring, Ladder and SFC programming, timer/counter logic, and basic troubleshooting on real Mechatronics training stations.',
    level: 'Basic',
    duration_hours: 27,
    price: 200,
    currency: 'USD',
    category: 'Delta PLC',
    format: 'Hybrid or F2F – Khaldeh',
    is_published: true,
    outcomes: [
      'Navigate ISPSoft and DIA Portal development environments',
      'Wire Delta DVP/AS200 digital and analog I/O modules',
      'Write Ladder Diagram and SFC programs',
      'Use timers, counters and arithmetic instructions',
      'Commission a basic automated sequence on real hardware',
    ],
  },
  {
    title: 'Delta PLC Pro: HMI, ModBus & VFD',
    slug: 'delta-pro',
    short_description: 'Delta DVP/AS200 with HMI, Modbus, Analog Sensors, VFD & PID on real machines. ($250)',
    description: 'Intermediate Delta PLC course — adds HMI panel development, analog sensor signal conditioning, Modbus RTU/TCP communication, VFD speed control, and PID closed-loop control. All practicals on real Mechatronics stations.',
    level: 'Pro',
    duration_hours: 27,
    price: 250,
    currency: 'USD',
    category: 'Delta PLC',
    format: 'Hybrid or F2F – Khaldeh',
    is_published: true,
    outcomes: [
      'Create HMI screens with Delta DOP series panels',
      'Read and scale 4–20 mA analog sensor signals',
      'Configure Modbus RTU master–slave between PLC and VFD',
      'Implement PID closed-loop speed and pressure control',
      'Diagnose wiring and communication faults on real plant',
    ],
  },
  {
    title: 'Delta PLC Advanced: Motion & Servo',
    slug: 'delta-adv',
    short_description: 'Delta DVP/AS200 with HMI, Modbus, VFD, PID, Stepper & Servo on real machines. ($300)',
    description: 'Advanced Delta PLC course covering stepper motor pulse output, servo drive commissioning, electronic cam profiles, multi-axis coordination, and complete system integration. Students deliver a full machine project using Delta PLC, HMI, VFD, and servo drive.',
    level: 'Advanced',
    duration_hours: 27,
    price: 300,
    currency: 'USD',
    category: 'Delta PLC',
    format: 'Hybrid or F2F – Khaldeh',
    is_published: true,
    outcomes: [
      'Generate high-speed pulse output to control a stepper motor',
      'Commission a Delta ASDA-B3 servo drive in position mode',
      'Implement electronic gearing between master and slave axes',
      'Integrate VFD, servo, and PLC in a multi-drive system',
      'Deliver a complete Delta automation project from spec to FAT',
    ],
  },
  {
    title: 'Delta PLC Bundle: All Levels',
    slug: 'delta-bundle',
    short_description: 'Complete Delta PLC series — Basic, Pro & Advanced combined at bundle price. ($700)',
    description: 'All three Delta PLC courses (Basic, Pro & Advanced) packaged into one continuous program. The most cost-effective path to full Delta DVP/AS PLC mastery, from first ladder rung to multi-axis servo systems.',
    level: 'All',
    duration_hours: 81,
    price: 700,
    currency: 'USD',
    category: 'Delta PLC',
    format: 'Hybrid or F2F – Khaldeh',
    is_published: true,
    outcomes: [
      'Full Delta DVP/AS200 PLC mastery — Basic through Advanced',
      'Develop HMI, VFD, PID and servo motion systems',
      'Configure Modbus RTU/TCP networks with multiple devices',
      'Deliver complete Delta automation projects independently',
    ],
  },
  {
    title: 'Delta PLC Maintenance & Troubleshooting',
    slug: 'delta-maint',
    short_description: 'Delta PLC maintenance, diagnostics and structured fault-finding for field engineers. ($200)',
    description: 'Practical maintenance and troubleshooting course for technicians and engineers supporting Delta PLC installations. Covers preventive maintenance routines, online monitoring in ISPSoft, I/O module replacement, communication fault diagnosis, and structured fault-finding methods.',
    level: 'Pro',
    duration_hours: 27,
    price: 200,
    currency: 'USD',
    category: 'Delta PLC',
    format: 'Hybrid or F2F – Khaldeh',
    is_published: true,
    outcomes: [
      'Execute a Delta PLC preventive maintenance checklist',
      'Use ISPSoft online monitoring and force I/O tools',
      'Diagnose and replace faulty I/O and CPU modules',
      'Fault-find Modbus and Delta Link communication errors',
      'Apply a systematic fault-finding methodology on live plant',
    ],
  },
  {
    title: 'Delta SCADA',
    slug: 'delta-scada',
    short_description: 'Delta SCADA system — visualization, data acquisition and industrial monitoring. ($900)',
    description: 'Professional Delta SCADA development course using DIAView software. Students build a full plant SCADA application: process graphics, live tag connections to Delta PLCs via Modbus, alarm management, historian, and management reporting.',
    level: 'Advanced',
    duration_hours: 27,
    price: 900,
    currency: 'USD',
    category: 'SCADA',
    format: 'Hybrid or F2F – Khaldeh',
    is_published: true,
    outcomes: [
      'Configure DIAView and connect to Delta PLCs via Modbus TCP',
      'Design dynamic P&ID-style SCADA graphics',
      'Implement alarm management with acknowledgment and history',
      'Set up the DIAView historian and generate trend reports',
      'Configure user security and access levels',
    ],
  },

  // ────────────────────────────────────────────────────────────────────────
  // OTHER COURSES  (prices in $)
  // ────────────────────────────────────────────────────────────────────────
  {
    title: 'EPLAN Electric Pro Panel',
    slug: 'eplan',
    short_description: 'Create professional panel designs in EPLAN Pro Panel — electrical schematics & single-line diagrams. ($100)',
    description: 'Practical EPLAN Electric P8 / Pro Panel course for electrical engineers and designers. Covers the full documentation workflow from schematic design and parts management to automatic BOM generation, terminal diagrams, and 3D panel layout.',
    level: 'Basic',
    duration_hours: 10,
    price: 100,
    currency: 'USD',
    category: 'Electrical',
    format: 'E & F2F – Khaldeh',
    is_published: true,
    outcomes: [
      'Create an EPLAN project and configure page types',
      'Draw single-line diagrams and full schematic circuits',
      'Assign parts from the manufacturer database',
      'Auto-generate BOM, terminal lists and cable schedules',
      'Produce a complete panel documentation package',
    ],
  },
  {
    title: 'SolidWorks 3D CAD',
    slug: 'solidworks',
    short_description: 'From fundamental sketching to advanced assembly techniques in SolidWorks 3D CAD. ($100)',
    description: 'Comprehensive SolidWorks 3D CAD course for engineers with no prior CAD experience. Covers parametric sketching, part modelling, assembly design, drawing generation, and introduction to simulation — building to a full mechanical enclosure project.',
    level: 'Basic',
    duration_hours: 11,
    price: 100,
    currency: 'USD',
    category: 'Mechanical',
    format: 'E & F2F – Khaldeh',
    is_published: true,
    outcomes: [
      'Create fully constrained 2D sketches in SolidWorks',
      'Build parametric 3D solid parts using Boss-Extrude and Revolve',
      'Assemble parts with Mate constraints and check for interference',
      'Generate 2D engineering drawings with GD&T annotations',
      'Apply basic static simulation to a structural component',
    ],
  },
  {
    title: 'Classic Control Bundle',
    slug: 'classic-control',
    short_description: 'All electrical low-voltage systems — MCC, protection, Star-Delta, EPLAN schematic design. ($350)',
    description: 'Complete low-voltage industrial electrical course covering Motor Control Centre (MCC) design, motor protection relay selection, Star-Delta and DOL starters, contactor/relay logic, and EPLAN schematic documentation. Ideal for technicians moving into panel building or field engineering.',
    level: 'Pro',
    duration_hours: 27,
    price: 350,
    currency: 'USD',
    category: 'Electrical',
    format: 'F2F – Khaldeh',
    is_published: true,
    outcomes: [
      'Design an MCC panel with DOL and Star-Delta starters',
      'Select and set motor protection relays (overcurrent, thermistor)',
      'Wire contactor and relay control circuits from schematics',
      'Draw complete LV panel schematics in EPLAN',
      'Perform pre-commissioning checks and insulation testing',
    ],
  },
  {
    title: 'Mechanical Systems: Hydraulics & Pneumatics',
    slug: 'mecha',
    short_description: 'Hydraulics, Pneumatics, Fluid & ThermoDynamics — fundamentals for automation engineers. ($350)',
    description: 'Fundamentals of mechanical systems for automation and electrical engineers. Covers hydraulic circuit design, pneumatic cylinder and valve selection, fluid power calculations, and basic thermodynamics applied to industrial machines — giving engineers a complete multi-discipline view.',
    level: 'Basic',
    duration_hours: 12,
    price: 350,
    currency: 'USD',
    category: 'Mechanical',
    format: 'F2F – Khaldeh',
    is_published: true,
    outcomes: [
      'Read and draw hydraulic and pneumatic circuit diagrams',
      'Calculate flow rates, pressure drops and cylinder forces',
      'Select solenoid valves, cylinders and actuators for a given load',
      'Apply basic thermodynamic principles to compressor sizing',
      'Perform maintenance on pneumatic and hydraulic components',
    ],
  },
]

// ─── Seed function ──────────────────────────────────────────────────────────
async function seed() {
  console.log('🗑  Deleting all existing courses…')
  const { error: delErr } = await supabase
    .from('courses')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // delete all rows

  if (delErr) {
    console.error('Delete failed:', delErr.message)
    process.exit(1)
  }
  console.log('✓ Existing courses removed.')

  console.log(`\n📚 Seeding ${courses.length} courses…`)
  for (const course of courses) {
    const { error } = await supabase.from('courses').insert(course)
    if (error) {
      console.error(`✗ "${course.title}": ${error.message}`)
    } else {
      const status = course.is_published === false ? ' (draft)' : ''
      console.log(`  ✓ [${course.level.padEnd(8)}] ${course.title}${status}`)
    }
  }

  const published = courses.filter(c => c.is_published !== false).length
  const draft = courses.filter(c => c.is_published === false).length
  console.log(`\n✅ Done — ${published} published, ${draft} draft.`)
}

seed().catch(console.error)
