const STORAGE_KEY = 'resume_builder_data';

export const saveResumeToStorage = (resumeData, resumeId = 'current') => {
  try {
    const data = {
      ...resumeData,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(`${STORAGE_KEY}_${resumeId}`, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Error saving resume to storage:', error);
    return false;
  }
};

export const loadResumeFromStorage = (resumeId = 'current') => {
  try {
    const data = localStorage.getItem(`${STORAGE_KEY}_${resumeId}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading resume from storage:', error);
    return null;
  }
};

export const getAllSavedResumes = () => {
  try {
    const resumes = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(STORAGE_KEY) && key !== `${STORAGE_KEY}_current`) {
        const resume = JSON.parse(localStorage.getItem(key));
        resumes.push({
          id: key.replace(`${STORAGE_KEY}_`, ''),
          ...resume
        });
      }
    }
    return resumes;
  } catch (error) {
    console.error('Error getting saved resumes:', error);
    return [];
  }
};

export const deleteResumeFromStorage = (resumeId) => {
  try {
    localStorage.removeItem(`${STORAGE_KEY}_${resumeId}`);
    return true;
  } catch (error) {
    console.error('Error deleting resume from storage:', error);
    return false;
  }
};

export const clearAllResumes = () => {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith(STORAGE_KEY)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    return true;
  } catch (error) {
    console.error('Error clearing resumes:', error);
    return false;
  }
};

export const exportResumeData = (resumeData) => {
  const dataStr = JSON.stringify(resumeData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `resume_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importResumeData = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
};