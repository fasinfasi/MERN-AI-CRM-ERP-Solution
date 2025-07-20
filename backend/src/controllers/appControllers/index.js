const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const { routesList } = require('@/models/utils');

const { globSync } = require('glob');
const path = require('path');
const fs = require('fs');

const pattern = './src/controllers/appControllers/*/';
const controllerDirectories = globSync(pattern).map((folderPath) => {
  return path.basename(folderPath);
});

const appControllers = () => {
  const controllers = {};
  const hasCustomControllers = [];

  console.log('Available controller directories:', controllerDirectories);

  controllerDirectories.forEach((controllerName) => {
    const controllerFilePath = path.join(
      __dirname,
      controllerName,
      controllerName + '.js'
    );

    console.log(`Checking controller: ${controllerName} at path: ${controllerFilePath}`);

    if (fs.existsSync(controllerFilePath)) {
      try {
        const customController = require(controllerFilePath);

        if (customController) {
          hasCustomControllers.push(controllerName);
          controllers[controllerName] = customController;
          console.log(`Loaded custom controller: ${controllerName}`);
        }
      } catch (err) {
        console.error(`Error loading controller ${controllerName}:`, err);
        throw new Error(
          `Error loading controller ${controllerName}: ${err.message}`
        );
      }
    }
  });

  console.log('Routes list:', routesList);
  console.log('Has custom controllers:', hasCustomControllers);

  routesList.forEach(({ modelName, controllerName }) => {
    console.log(`Processing route: ${modelName} -> ${controllerName}`);
    if (!hasCustomControllers.includes(controllerName)) {
      console.log(`Creating CRUD controller for: ${modelName}`);
      controllers[controllerName] = createCRUDController(modelName);
    }
  });

  return controllers;
};

module.exports = appControllers();
