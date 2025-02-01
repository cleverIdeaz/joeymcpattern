'use client';

import { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRandom, 
  faUndo, 
  faPlus, 
  faEnvelope, 
  faDownload 
} from '@fortawesome/free-solid-svg-icons';
import styles from './MarbleDesigner.module.css';
import html2canvas from 'html2canvas';

interface AccentColor {
  color: string;
  concentration: number;
}

const coolColors = {
  'Cinnabar': '#E34234',
  'Malachite': '#469496',
  'Cerulean Frost': '#6D9BC3',
  'Citrine': '#E4D00A',
  'Pearly Purple': '#B768A2',
  'Aquamarine': '#7FFFD4',
  'Cool Grey': '#8C92AC',
  'Mango Purée': '#FF6137'
};

const baseColors = [
  { name: 'Snow Drift (White)', value: '#F3F3F3' },
  { name: 'Onyx (Black)', value: '#353839' },
  { name: 'Natural', value: '#F5DEB3' }
];

export default function MarbleDesigner() {
  const [baseColor, setBaseColor] = useState(baseColors[0].value);
  const [accents, setAccents] = useState<AccentColor[]>([
    { color: Object.values(coolColors)[0], concentration: 50 }
  ]);

  const generateOrganicShape = useCallback((size: number) => {
    const points = [];
    const numPoints = 10;
    const center = size / 2;
    
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;
      const radius = (Math.random() * 0.3 + 0.7) * center; // 70-100% of radius
      const x = center + Math.cos(angle) * radius;
      const y = center + Math.sin(angle) * radius;
      points.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    
    return `M ${points.join(' L ')} Z`;
  }, []);

  const addAccent = useCallback(() => {
    if (accents.length < 3) {
      setAccents(prev => [
        ...prev,
        { color: Object.values(coolColors)[0], concentration: 50 }
      ]);
    }
  }, [accents.length]);

  const removeAccent = useCallback((index: number) => {
    setAccents(prev => prev.filter((_, i) => i !== index));
  }, []);

  const updateAccent = useCallback((index: number, updates: Partial<AccentColor>) => {
    setAccents(prev => prev.map((accent, i) => 
      i === index ? { ...accent, ...updates } : accent
    ));
  }, []);

  const randomizeDesign = useCallback(() => {
    setBaseColor(baseColors[Math.floor(Math.random() * baseColors.length)].value);
    const numAccents = Math.floor(Math.random() * 2) + 1;
    const newAccents = Array(numAccents).fill(null).map(() => ({
      color: Object.values(coolColors)[Math.floor(Math.random() * Object.keys(coolColors).length)],
      concentration: Math.random() * 60 + 20
    }));
    setAccents(newAccents);
  }, []);

  const resetDesign = useCallback(() => {
    setBaseColor(baseColors[0].value);
    setAccents([{ color: Object.values(coolColors)[0], concentration: 50 }]);
  }, []);

  const downloadDesign = useCallback(async () => {
    try {
      // Create a canvas element
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // Set canvas size to match preview dimensions (with higher resolution)
      canvas.width = 800; // 2x width for better quality
      canvas.height = 1200; // 2x height for better quality

      // Draw background
      ctx.fillStyle = baseColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw accents
      accents.forEach(accent => {
        const particleCount = Math.pow(accent.concentration / 100, 2) * 900;
        for (let i = 0; i < particleCount; i++) {
          const size = Math.random() < 0.7 ? 
            Math.random() * 34 + 6 : // 70% small particles (doubled for resolution)
            Math.random() * 40 + 60; // 30% large particles (doubled for resolution)

          const x = Math.random() * canvas.width;
          const y = Math.random() * canvas.height;

          // Create path for organic shape
          ctx.beginPath();
          const points = [];
          const numPoints = 10;
          const center = size / 2;
          
          for (let j = 0; j < numPoints; j++) {
            const angle = (j / numPoints) * 2 * Math.PI;
            const radius = (Math.random() * 0.3 + 0.7) * center;
            const pointX = x + Math.cos(angle) * radius;
            const pointY = y + Math.sin(angle) * radius;
            
            if (j === 0) {
              ctx.moveTo(pointX, pointY);
            } else {
              ctx.lineTo(pointX, pointY);
            }
          }
          
          ctx.closePath();
          ctx.fillStyle = accent.color;
          ctx.fill();
        }
      });

      // Save the canvas as PNG
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
      const filename = `marble-plastics-pattern-${timestamp}.png`;
      
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Show success message
      const successMsg = document.createElement('div');
      successMsg.style.color = '#4CAF50';
      successMsg.style.marginTop = '0.5rem';
      successMsg.style.fontSize = '0.9rem';
      successMsg.style.textAlign = 'center';
      successMsg.textContent = 'Pattern saved successfully!';
      const downloadBtn = document.getElementById('downloadBtn');
      downloadBtn?.parentNode?.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 3000);
    } catch (error) {
      console.error('Error saving pattern:', error);
      alert('There was an error saving your pattern. Please try again.');
    }
  }, [baseColor, accents]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Custom Sheet Designer</h1>
        <p className={styles.subtitle}>Create your perfect recycled plastic sheet design</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.quickActions}>
          <button className={styles.quickActionBtn} onClick={randomizeDesign}>
            <FontAwesomeIcon icon={faRandom} /> Randomize
          </button>
          <button className={styles.quickActionBtn} onClick={resetDesign}>
            <FontAwesomeIcon icon={faUndo} /> Reset
          </button>
        </div>

        <div className={styles.controlGroup}>
          <label>Base Material</label>
          <select 
            className={styles.select}
            value={baseColor}
            onChange={(e) => setBaseColor(e.target.value)}
          >
            {baseColors.map(color => (
              <option key={color.value} value={color.value}>
                {color.name}
              </option>
            ))}
          </select>
        </div>

        {accents.map((accent, index) => (
          <div key={index} className={styles.accentControl}>
            <div className={styles.controlGroup}>
              <label>Accent Color</label>
              <select
                className={styles.select}
                value={accent.color}
                onChange={(e) => updateAccent(index, { color: e.target.value })}
              >
                {Object.entries(coolColors).map(([name, hex]) => (
                  <option key={hex} value={hex}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
            <label>Concentration</label>
            <input
              type="range"
              className={styles.slider}
              min="0"
              max="100"
              value={accent.concentration}
              onChange={(e) => updateAccent(index, { concentration: Number(e.target.value) })}
            />
            <button 
              className={styles.removeAccent}
              onClick={() => removeAccent(index)}
            >
              Remove
            </button>
          </div>
        ))}

        <button className={styles.button} onClick={addAccent}>
          <FontAwesomeIcon icon={faPlus} /> Add Accent Color
        </button>

        <div className={styles.actionButtons}>
          <a
            href="mailto:joseph@marbleplastics.com?subject=Quote Request for Custom Pattern"
            className={styles.ctaButton}
          >
            <FontAwesomeIcon icon={faEnvelope} /> Request Quote
          </a>
          <button 
            id="downloadBtn"
            className={`${styles.ctaButton} ${styles.downloadButton}`}
            onClick={downloadDesign}
          >
            <FontAwesomeIcon icon={faDownload} /> Save Pattern
          </button>
        </div>
        <div className={styles.actionInfo}>
          Save your pattern and attach it to the quote request email
        </div>
      </div>

      <div className={styles.preview}>
        <div 
          id="previewCanvas" 
          className={styles.previewCanvas}
          style={{ backgroundColor: baseColor }}
        >
          {accents.map((accent, accentIndex) => {
            const particleCount = Math.pow(accent.concentration / 100, 2) * 900;
            return Array.from({ length: Math.floor(particleCount) }).map((_, i) => {
              const size = Math.random() < 0.7 ? 
                Math.random() * 17 + 3 : // 70% small particles
                Math.random() * 20 + 30; // 30% large particles

              return (
                <svg
                  key={`${accentIndex}-${i}`}
                  className={styles.accent}
                  width={size}
                  height={size}
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                >
                  <path
                    d={generateOrganicShape(size)}
                    fill={accent.color}
                  />
                </svg>
              );
            });
          })}
        </div>
        <div className={styles.previewInfo}>
          <p>4" × 6" sheet preview</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
            Colors may vary slightly in final product
          </p>
        </div>
      </div>
    </div>
  );
}
