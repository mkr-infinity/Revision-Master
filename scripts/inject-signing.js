#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const gradlePath = path.join(process.cwd(), 'android', 'app', 'build.gradle');
const keystorePropsPath = path.join(process.cwd(), 'android', 'keystore.properties');

if (!fs.existsSync(gradlePath)) {
  console.error('build.gradle not found at:', gradlePath);
  process.exit(1);
}

let content = fs.readFileSync(gradlePath, 'utf8');

if (content.includes('signingConfigs')) {
  console.log('signingConfigs already present — skipping injection.');
  process.exit(0);
}

const signingBlock = `
    signingConfigs {
        release {
            def keystorePropsFile = rootProject.file('keystore.properties')
            def keystoreProps = new Properties()
            if (keystorePropsFile.exists()) {
                keystoreProps.load(new FileInputStream(keystorePropsFile))
            }
            storeFile file(keystoreProps['storeFile'] ?: 'release-key.jks')
            storePassword keystoreProps['storePassword'] ?: System.getenv('SIGNING_STORE_PASSWORD') ?: ''
            keyAlias keystoreProps['keyAlias'] ?: System.getenv('SIGNING_KEY_ALIAS') ?: ''
            keyPassword keystoreProps['keyPassword'] ?: System.getenv('SIGNING_KEY_PASSWORD') ?: ''
        }
    }
`;

if (content.includes('buildTypes {')) {
  content = content.replace('buildTypes {', signingBlock + '\n    buildTypes {');
} else {
  content = content.replace('android {', 'android {' + signingBlock);
}

content = content.replace(
  /(\s+release\s*\{)/,
  '$1\n            signingConfig signingConfigs.release'
);

if (!content.includes("import java.util.Properties")) {
  content = content.replace(
    /^android \{/m,
    "import java.util.Properties\nimport java.io.FileInputStream\n\nandroid {"
  );
}

fs.writeFileSync(gradlePath, content, 'utf8');
console.log('Signing config injected successfully into build.gradle.');
