#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const gradlePath = path.join(process.cwd(), 'android', 'app', 'build.gradle');

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
            storeFile file("release-key.jks")
            storePassword System.getenv("SIGNING_STORE_PASSWORD") ?: ""
            keyAlias System.getenv("SIGNING_KEY_ALIAS") ?: ""
            keyPassword System.getenv("SIGNING_KEY_PASSWORD") ?: ""
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

fs.writeFileSync(gradlePath, content, 'utf8');
console.log('Signing config injected successfully into build.gradle.');
