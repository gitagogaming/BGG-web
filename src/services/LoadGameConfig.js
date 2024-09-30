// src/services/configService.js
import yaml from 'js-yaml';

const CONFIG_STORAGE_KEY = 'gameConfigs';

export const fetchAllConfigs = async () => {
    try {
        const response = await fetch('/config');
        const configs = await response.json(); // Parse the JSON response
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(configs));
        return configs;
    } catch (error) {
        console.error('Error fetching the YAML configs:', error);
        throw error;
    }
};

export const importConfig = async (configFilePath) => {
    try {
        const response = await fetch(configFilePath);
        const fileText = await response.text(); // Get the text content of the file
        const yamlData = yaml.load(fileText); // Parse the YAML content
        const existingConfigs = JSON.parse(localStorage.getItem(CONFIG_STORAGE_KEY)) || [];
        const updatedConfigs = [...existingConfigs, yamlData];
        localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(updatedConfigs));
        return yamlData;
    } catch (error) {
        console.error('Error importing the YAML config:', error);
        throw error;
    }
};

export const getConfigsFromStorage = () => {
    return JSON.parse(localStorage.getItem(CONFIG_STORAGE_KEY)) || [];
};