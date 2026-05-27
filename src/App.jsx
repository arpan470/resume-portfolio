import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
// Import only verified icons from react-icons
import { 
  FiMail, FiPhone, FiDownload, FiGithub, FiLinkedin, FiMapPin,
  FiCalendar, FiAward, FiCode, FiCloud, FiDatabase, FiGlobe,
  FiChevronRight, FiBriefcase, FiServer, FiTerminal,
  FiExternalLink, FiStar, FiSend, FiCheckCircle, FiAlertCircle,
  FiUser, FiMessageSquare, FiFileText, FiX, FiLoader, FiEye
} from 'react-icons/fi';
import { FaGraduationCap } from 'react-icons/fa';
import profilePic from './assets/profile.jpg';

// Custom icons for missing ones
const SparklesIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3L14 8L19 10L14 12L12 17L10 12L5 10L10 8L12 3Z" />
    <path d="M19 4L20 7L23 8L20 9L19 12L18 9L15 8L18 7L19 4Z" />
  </svg>
);

const CoffeeIcon = ({ size = 20 }) => (
  <span role="img" aria-label="coffee" style={{ fontSize: size }}>
    ☕
  </span>
);

export default function App() {
  const [isHovered, setIsHovered] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    success: false,
    message: '',
    loading: false
  });
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  
  const { scrollYProgress } = useScroll();
  const contactRef = useRef(null);
  const formRef = useRef(null);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (formStatus.message) {
      setFormStatus({ ...formStatus, message: '' });
    }
  };

  // Validate form
  const validateForm = () => {
    if (!formData.name.trim()) {
      setFormStatus({ ...formStatus, message: 'Please enter your name', success: false });
      return false;
    }
    if (!formData.email.trim()) {
      setFormStatus({ ...formStatus, message: 'Please enter your email', success: false });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormStatus({ ...formStatus, message: 'Please enter a valid email address', success: false });
      return false;
    }
    if (!formData.message.trim()) {
      setFormStatus({ ...formStatus, message: 'Please enter your message', success: false });
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setFormStatus({ ...formStatus, loading: true, message: '' });
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save to localStorage
      const messages = JSON.parse(localStorage.getItem('contact_messages') || '[]');
      messages.push({ 
        ...formData, 
        timestamp: new Date().toISOString(),
        id: Date.now()
      });
      localStorage.setItem('contact_messages', JSON.stringify(messages));
      
      setFormStatus({
        submitted: true,
        success: true,
        message: 'Thank you! Your message has been sent successfully. I\'ll get back to you soon!',
        loading: false
      });
      
      setFormData({ name: '', email: '', subject: '', message: '' });
      
      setTimeout(() => {
        setFormStatus({ submitted: false, success: false, message: '', loading: false });
      }, 5000);
      
    } catch (error) {
      setFormStatus({
        submitted: true,
        success: false,
        message: 'Oops! Something went wrong. Please try again later.',
        loading: false
      });
    }
  };

  // Handle PDF Download
  const handleDownloadPDF = async () => {
    setDownloadProgress(0);
    
    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);
    
    setTimeout(() => {
      const pdfUrl = '/resume.pdf';
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = 'Gurarpan_Singh_Resume.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setTimeout(() => {
        setDownloadProgress(0);
      }, 1000);
    }, 1000);
  };

  const generateAndDownloadPDF = () => {
    handleDownloadPDF();
  };

  // Skills data
  const technicalSkills = [
    { name: 'C++', level: 55, icon: <FiTerminal size={20} /> },
    { name: 'Java', level: 60, icon: <CoffeeIcon size={20} /> },
    { name: 'Python', level: 60, icon: <FiCode size={20} /> },
    { name: 'JavaScript', level: 60, icon: <FiGlobe size={20} /> },
    { name: 'PigLatin', level: 70, icon: <FiDatabase size={20} /> }
  ];

  const otherSkills = [
    { name: 'AWS Basics', category: 'Cloud Computing', icon: <FiCloud size={18} /> },
    { name: 'HDFS', category: 'Big Data', icon: <FiServer size={18} /> },
    { name: 'SQL', category: 'Database', icon: <FiDatabase size={18} /> }
  ];

  const projects = [
    {
      title: 'Portfolio Website',
      description: 'Modern responsive portfolio with animations and interactive UI',
      tech: ['React', 'Framer Motion', 'CSS'],
      icon: <FiGlobe size={24} />
    },
    {
      title: 'Data Analysis Pipeline',
      description: 'Big data processing using Hadoop ecosystem and PigLatin',
      tech: ['PigLatin', 'HDFS', 'SQL'],
      icon: <FiDatabase size={24} />
    },
    {
      title: 'Cloud-Based Application',
      description: 'AWS-powered web application with scalable architecture',
      tech: ['AWS Basics'],
      icon: <FiCloud size={24} />
    },
    {
      title: 'Print & Fold',
      description: 'Stationery website with HTML and CSS content management',
      tech: ['HTML5', 'CSS3'],
      icon: <FiExternalLink size={24} />
    }
  ];

  const achievements = [
  { title: 'NPTEL Cloud Computing', description: 'Elite Certification – Successfully completed Cloud Computing course through NPTEL (SWAYAM)' },

  { title: 'NPTEL Machine Learning', description: 'Successfully completed Machine Learning course through NPTEL (SWAYAM)' },

  { title: 'Academic Excellence', description: '92.4% in 10th Board Examinations' },

  { title: 'Programming Enthusiast', description: 'Strong foundation in DSA & OOP concepts' },

  { title: '1st Place', description: 'Inter College Poetry Writing Competition' },

  { title: '3rd Place', description: 'VIKSIT BHARAT - 2047 Declamation' },

  { title: 'Active Participant', description: 'IKGPTU North Zone Youth Fest 2024 - 2025 Creative Writing (Poetry) Competition' },

  { title: 'Stage Anchor', description: 'Inter School and College Events' },

  { title: 'AI Creators Workshop', description: 'Conducted by MITS Academy on AI and Machine Learning' }
];


  return (
    <div className="app-container">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      {/* Progress Bar */}
      <motion.div 
        className="progress-bar"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Main Content */}
      <div className="content-wrapper">
        <div className="max-w-6xl mx-auto px-4 py-8">
          
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
            className="header-card"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            <motion.div 
              className="header-content"
              animate={{ scale: isHovered ? 1.02 : 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className="profile-section">
                <motion.div 
                  className="profile-image-wrapper"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <img
                    src={profilePic}
                    alt="Gurarpan Singh"
                    className="profile-image"
                  />
                  <motion.div 
                    className="profile-ring"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>

                <div className="profile-info">
                  <motion.h1 
                    className="profile-name"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Gurarpan Singh
                  </motion.h1>

                  <motion.div 
                    className="badge-container"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <span className="badge badge-primary">
                      <FaGraduationCap size={14} />
                      B.Tech CSE
                    </span>
                    <span className="badge badge-secondary">
                      <FiCalendar size={14} />
                      6th Semester
                    </span>
                    <span className="badge badge-success">
                      <FiBriefcase size={14} />
                      Seeking Internship & Training
                    </span>
                  </motion.div>

                  <motion.p 
                    className="profile-title"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Passionate Computer Science Student | Data Analysis Enthusiast
                  </motion.p>

                  <motion.div 
                    className="contact-grid"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="contact-item">
                      <FiMail size={18} />
                      <span>sgurarpan1699@gmail.com</span>
                    </div>
                    <div className="contact-item">
                      <FiPhone size={18} />
                      <span>+91 9815723757</span>
                    </div>
                    <div className="contact-item">
                      <FiMapPin size={18} />
                      <span>Amritsar, India</span>
                    </div>
                  </motion.div>

                  <motion.div 
                    className="action-buttons"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <motion.button
                      onClick={generateAndDownloadPDF}
                      className="btn-primary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={downloadProgress > 0}
                    >
                      {downloadProgress > 0 ? (
                        <>
                          <FiLoader size={18} className="spin" />
                          Downloading {downloadProgress}%
                        </>
                      ) : (
                        <>
                          <FiDownload size={18} />
                          Download Resume
                        </>
                      )}
                    </motion.button>
                    
                    <motion.a
                      href="#contact"
                      className="btn-secondary"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FiMail size={18} />
                      Contact Me
                    </motion.a>
                    
                    <motion.button
                      onClick={() => setShowResumeModal(true)}
                      className="btn-icon"
                      whileHover={{ scale: 1.1, y: -2 }}
                    >
                      <FiEye size={20} />
                    </motion.button>
                    
                    <motion.a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-icon"
                      whileHover={{ scale: 1.1, y: -2 }}
                    >
                      <FiGithub size={20} />
                    </motion.a>
                    
                    <motion.a
                      href="https://linkedin.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-icon"
                      whileHover={{ scale: 1.1, y: -2 }}
                    >
                      <FiLinkedin size={20} />
                    </motion.a>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Profile Summary */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="summary-card"
          >
            <div className="card-header">
              <SparklesIcon size={24} className="card-icon" />
              <h2 className="card-title">Profile Summary</h2>
            </div>
            <p className="summary-text">
              Passionate and detail-oriented B.Tech Computer Science student with strong
              skills in programming and problem-solving. Interested in data analysis,
              cloud technologies, and software development. Looking for internship and
              industrial training opportunities to gain real-world experience in
              innovative tech environments.
            </p>
          </motion.div>

          {/* Education & Skills */}
          <div className="grid lg:grid-cols-2 gap-6 mt-8">
            {/* Education Section */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="education-card"
            >
              <div className="card-header">
                <FaGraduationCap size={24} className="card-icon" />
                <h2 className="card-title">Education</h2>
              </div>

              <div className="timeline">
                <motion.div 
                  className="timeline-item"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="timeline-dot blue"></div>
                  <div className="timeline-content">
                    <h3>B.Tech Computer Science</h3>
                    <p className="institution">Amritsar Group of Colleges, Amritsar</p>
                    <p className="date">2023 – 2027</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="timeline-item"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="timeline-dot indigo"></div>
                  <div className="timeline-content">
                    <h3>12th Standard</h3>
                    <p className="institution">D.A.V. International School, Amritsar</p>
                    <p className="date">2021 – 2023</p>
                    <p className="grade">Percentage: 77.6%</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="timeline-item"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="timeline-dot purple"></div>
                  <div className="timeline-content">
                    <h3>10th Standard</h3>
                    <p className="institution">Sacred Heart Convent School, Majitha</p>
                    <p className="date">2021</p>
                    <p className="grade">Percentage: 92.4%</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Skills Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="skills-card"
            >
              <div className="card-header">
                <FiCode size={24} className="card-icon" />
                <h2 className="card-title">Technical Skills</h2>
              </div>

              <div className="skills-container">
                {technicalSkills.map((skill, index) => (
                  <motion.div 
                    key={skill.name}
                    className="skill-item"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="skill-header">
                      <span className="skill-icon">{skill.icon}</span>
                      <span className="skill-name">{skill.name}</span>
                      <span className="skill-percentage">{skill.level}%</span>
                    </div>
                    <div className="progress-bar-bg">
                      <motion.div 
                        className="progress-bar-fill"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="other-skills-title">Other Competencies</h3>
                <div className="skills-grid">
                  {otherSkills.map((skill, index) => (
                    <motion.div 
                      key={skill.name}
                      className="skill-tag"
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      {skill.icon}
                      <span>{skill.name}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Projects Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="projects-card mt-8"
          >
            <div className="card-header">
              <FiBriefcase size={24} className="card-icon" />
              <h2 className="card-title">Featured Projects</h2>
            </div>

            <div className="projects-grid">
              {projects.map((project, index) => (
                <motion.div 
                  key={project.title}
                  className="project-item"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="project-icon">
                    {project.icon}
                  </div>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-tech">
                    {project.tech.map(tech => (
                      <span key={tech} className="tech-badge">{tech}</span>
                    ))}
                  </div>
                  <motion.a 
                    href="#" 
                    className="project-link"
                    whileHover={{ x: 5 }}
                  >
                    Learn More <FiChevronRight size={16} />
                  </motion.a>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Achievements Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="achievements-card mt-8"
          >
            <div className="card-header">
              <FiAward size={24} className="card-icon" />
              <h2 className="card-title">Key Achievements</h2>
            </div>

            <div className="achievements-grid">
              {achievements.map((achievement, index) => (
                <motion.div 
                  key={achievement.title}
                  className="achievement-item"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <FiAward size={32} className="achievement-icon" />
                  <h3>{achievement.title}</h3>
                  <p>{achievement.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Contact Form Section */}
          <motion.div
            id="contact"
            ref={contactRef}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="contact-card mt-8"
          >
            <div className="card-header">
              <FiSend size={24} className="card-icon" />
              <h2 className="card-title">Get In Touch</h2>
            </div>

            <div className="contact-wrapper">
              <div className="contact-info">
                <h3>Let's Connect</h3>
                <p>I'm always excited to connect with new people and explore opportunities. Feel free to reach out!</p>
                
                <div className="info-items">
                  <div className="info-item">
                    <FiMail size={20} />
                    <div>
                      <strong>Email</strong>
                      <span>sgurarpan1699@gmail.com</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <FiPhone size={20} />
                    <div>
                      <strong>Phone</strong>
                      <span>+91 9815723757</span>
                    </div>
                  </div>
                  <div className="info-item">
                    <FiMapPin size={20} />
                    <div>
                      <strong>Location</strong>
                      <span>Amritsar - 143601, India</span>
                    </div>
                  </div>
                </div>

                <div className="social-links">
                  <h4>Follow Me</h4>
                  <div className="social-icons">
                    <a href="https://github.com" target="_blank" rel="noopener noreferrer"><FiGithub size={20} /></a>
                    <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FiLinkedin size={20} /></a>
                    <a href="mailto:sgurarpan1699@gmail.com"><FiMail size={20} /></a>
                  </div>
                </div>
              </div>

              <div className="contact-form-container">
                <form ref={formRef} onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <label htmlFor="name">
                      <FiUser size={16} />
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your Name"
                      disabled={formStatus.loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      <FiMail size={16} />
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="email@example.com"
                      disabled={formStatus.loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">
                      <FiFileText size={16} />
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Internship Opportunity"
                      disabled={formStatus.loading}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">
                      <FiMessageSquare size={16} />
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows="5"
                      placeholder="Your message here..."
                      disabled={formStatus.loading}
                    ></textarea>
                  </div>

                  <motion.button
                    type="submit"
                    className="submit-btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={formStatus.loading}
                  >
                    {formStatus.loading ? (
                      <>
                        <FiLoader size={20} className="spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiSend size={20} />
                        Send Message
                      </>
                    )}
                  </motion.button>

                  <AnimatePresence>
                    {formStatus.message && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={`form-message ${formStatus.success ? 'success' : 'error'}`}
                      >
                        {formStatus.success ? <FiCheckCircle size={18} /> : <FiAlertCircle size={18} />}
                        {formStatus.message}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.footer 
            className="footer"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <p>© 2025 Gurarpan Singh. All rights reserved.</p>
            <div className="footer-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
            </div>
          </motion.footer>
        </div>
      </div>

      {/* Resume Preview Modal */}
      <AnimatePresence>
        {showResumeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal-overlay"
            onClick={() => setShowResumeModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Resume Preview</h3>
                <button onClick={() => setShowResumeModal(false)} className="modal-close">
                  <FiX size={24} />
                </button>
              </div>
              <div className="modal-body">
                <div className="resume-preview">
                  <h4>Gurarpan Singh</h4>
                  <p>B.Tech CSE Student | Seeking Internship Opportunities</p>
                  <hr />
                  <div className="resume-section">
                    <h5>Education</h5>
                    <ul>
                      <li><strong>B.Tech CSE</strong> - Amritsar Group of Colleges (2023-2027)</li>
                      <li><strong>12th</strong> - D.A.V. International School (77.6%)</li>
                      <li><strong>10th</strong> - Sacred Heart Convent School (92.4%)</li>
                    </ul>
                  </div>
                  <div className="resume-section">
                    <h5>Technical Skills</h5>
                    <ul>
                      <li>C++, Java, Python, JavaScript</li>
                      <li>HTML, CSS, React.js</li>
                      <li>AWS Basics, Cloud Computing</li>
                      <li>Data Analysis: PigLatin, HDFS, SQL</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button onClick={generateAndDownloadPDF} className="btn-primary">
                  <FiDownload size={18} />
                  Download Full Resume
                </button>
                <button onClick={() => setShowResumeModal(false)} className="btn-secondary">
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}