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

  controllerDirectories.forEach((controllerName) => {
    const controllerFilePath = path.join(
      __dirname,
      controllerName,
      controllerName + '.js'
    );

    if (fs.existsSync(controllerFilePath)) {
      try {
        const customController = require(controllerFilePath);

        if (customController) {
          hasCustomControllers.push(controllerName);
          controllers[controllerName] = customController;
        }
      } catch (err) {
        throw new Error(
          `Error loading controller ${controllerName}: ${err.message}`
        );
      }
    }
  });

  routesList.forEach(({ modelName, controllerName }) => {
    if (!hasCustomControllers.includes(controllerName)) {
      controllers[controllerName] = createCRUDController(modelName);
    }
  });

  return controllers;
};

module.exports = appControllers();
