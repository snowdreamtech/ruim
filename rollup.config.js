import vue from 'rollup-plugin-vue';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2'
import jsx from "acorn-jsx";

const fs = require('fs-extra');
const path = require('path');

let entries = [];

let globalDependencies = {
    'vue': 'Vue',
}

let externalDependencies = [
    'vue'
]

function addEntry(folder, inFile, outFile) {
    entries.push({
        input: 'src/components/' + folder + '/' + inFile,
        output: [
            {
                format: 'umd',
                name: outFile,
                file: 'dist/' + folder + '/' + outFile + '.umd.js',
                globals: globalDependencies
            },
            {
                format: 'esm',
                name: outFile,
                file: 'dist/' + folder + '/' + outFile + '.esm.js',
                globals: globalDependencies
            },
            {
                format: 'iife',
                name: outFile,
                file: 'dist/' + folder + '/' + outFile + '.iife.js',
                globals: globalDependencies
            }
        ],
        plugins: [
            vue(),
            typescript({
                // Absolute path to import correct config in e2e tests
                tsconfig: path.resolve(__dirname, 'tsconfig.json'),
            }),
            postcss()
        ],
        acornInjectPlugins: [jsx()],
        external: externalDependencies
    });

    entries.push({
        input: 'src/components/' + folder + '/' + inFile,
        output: [
            {
                format: 'umd',
                name: outFile,
                file: 'dist/' + folder + '/' + outFile + '.umd.min.js',
                globals: globalDependencies
            },
            {
                format: 'esm',
                name: outFile,
                file: 'dist/' + folder + '/' + outFile + '.esm.min.js',
                globals: globalDependencies
            },
            {
                format: 'iife',
                name: outFile,
                file: 'dist/' + folder + '/' + outFile + '.iife.min.js',
                globals: globalDependencies
            }
        ],
        plugins: [
            vue(),
            typescript({
                tsconfig: path.resolve(__dirname, 'tsconfig.json'),
              }),
            postcss(),
            // terser()
        ],
        acornInjectPlugins: [jsx()],
        external: externalDependencies
    });
}

function addSFC() {
    fs.readdirSync(path.resolve(__dirname, './src/components/')).forEach(folder => {
        fs.readdirSync(path.resolve(__dirname, './src/components/' + folder)).forEach(file => {
            let name = file.split(/(.vue)$|(.ts)$|(.tsx)$|(.js)$/)[0].toLowerCase();
 
            if (/\.tsx$/.test(file) && (name === folder)) {
                addEntry(folder, file, name);
            }
        });
    });
}

function addDirectives() {
    addEntry('badgedirective', 'BadgeDirective.js', 'badgedirective');
    addEntry('ripple', 'Ripple.js', 'ripple');
    addEntry('tooltip', 'Tooltip.js', 'tooltip');
    addEntry('styleclass', 'StyleClass.js', 'styleclass');
}

function addConfig() {
    addEntry('config', 'PrimeVue.js', 'config');
}

function addUtils() {
    addEntry('utils', 'Utils.js', 'utils');
}

function addApi() {
    addEntry('api', 'Api.js', 'api');
}

function addServices() {
    addEntry('confirmationservice', 'ConfirmationService.js', 'confirmationservice');
    addEntry('confirmationeventbus', 'ConfirmationEventBus.js', 'confirmationeventbus');
    addEntry('useconfirm', 'UseConfirm.js', 'useconfirm');
    addEntry('toastservice', 'ToastService.js', 'toastservice');
    addEntry('toasteventbus', 'ToastEventBus.js', 'toasteventbus');
    addEntry('overlayeventbus', 'OverlayEventBus.js', 'overlayeventbus');
    addEntry('usetoast', 'UseToast.js', 'usetoast');
    addEntry('terminalservice', 'TerminalService.js', 'terminalservice');
}

addSFC();
// addDirectives();
// addConfig();
// addUtils();
// addApi();
// addServices();

export default entries;
