/* DDS reference preparation tool. Node.js 18+, built-in modules only.
   This unpacks verified design references; it does not install runtime UI,
   edit application files, register AI rules, or connect production styles. */
(async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const crypto = await import('node:crypto');
  const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
  const args = process.argv.slice(2);
  const options = {};
  for (let index=0; index<args.length; index++) {
    const flag = args[index];
    if (flag === '--dry-run') {if (options.dryRun) throw new Error('Duplicate --dry-run.'); options.dryRun=true; continue;}
    if (!['--version','--bundle','--manifest','--target'].includes(flag) || options[flag] || !args[index+1] || args[index+1].startsWith('--')) throw new Error('Usage: node dds-install.js --version <version> --bundle bundle.json --manifest manifest.json --target docs/dds/0.2.0 [--dry-run]');
    options[flag] = args[++index];
  }
  for (const flag of ['--version','--bundle','--manifest','--target']) if (!options[flag]) throw new Error('Missing ' + flag + '.');
  if (!/^\d+\.\d+\.\d+$/.test(options['--version'])) throw new Error('An exact DDS version is required.');

  const assertNoLinks = file => {
    const absolute = path.resolve(file);
    const parsed = path.parse(absolute);
    let current = parsed.root;
    for (const part of absolute.slice(parsed.root.length).split(path.sep).filter(Boolean)) {
      current = path.join(current, part);
      if (fs.existsSync(current) || (()=>{try{return fs.lstatSync(current).isSymbolicLink();}catch{return false;}})()) {
        if (fs.lstatSync(current).isSymbolicLink()) throw new Error('Symbolic links are not allowed: ' + current);
      }
    }
    return absolute;
  };
  const readFile = filename => {
    const absolute = assertNoLinks(filename);
    if (!fs.statSync(absolute).isFile()) throw new Error('Expected a regular file: ' + absolute);
    return fs.readFileSync(absolute);
  };
  const manifestBytes = readFile(options['--manifest']);
  if (manifestBytes.length > 1024*1024) throw new Error('Manifest is too large.');
  const manifest = JSON.parse(manifestBytes);
  const bundleBytes = readFile(options['--bundle']);
  if (bundleBytes.length > 64*1024*1024) throw new Error('Reference bundle is too large.');
  if (manifest.schemaVersion !== 1 || manifest.kind !== 'DDSReferenceRelease' || manifest.designSystem !== 'DDS' || manifest.packageType !== 'reference' || manifest.runtimeIntegrated !== false || manifest.version !== options['--version']) throw new Error('Manifest does not match the requested DDS reference version.');
  if (manifest.bundle?.file !== 'bundle.json' || manifest.bundle.bytes !== bundleBytes.length || manifest.bundle.sha256 !== sha256(bundleBytes)) throw new Error('DDS bundle integrity check failed.');
  const installerBytes = readFile(process.argv[1]);
  if (manifest.installer?.file !== 'dds-install.js' || manifest.installer.bytes !== installerBytes.length || manifest.installer.sha256 !== sha256(installerBytes)) throw new Error('Run the installer supplied by the same frozen DDS release.');
  const bundle = JSON.parse(bundleBytes);
  if (bundle.schemaVersion !== 1 || bundle.kind !== 'DDSReferenceBundle' || bundle.designSystem !== 'DDS' || bundle.packageType !== 'reference' || bundle.runtimeIntegrated !== false || bundle.version !== options['--version'] || !Array.isArray(bundle.files) || !Array.isArray(manifest.files) || bundle.files.length === 0 || bundle.files.length > 250) throw new Error('Invalid DDS reference bundle.');

  const seen = new Set();
  const entries = [];
  let totalBytes = 0;
  for (let index=0; index<bundle.files.length; index++) {
    const entry = bundle.files[index];
    const filename = entry.path;
    if (typeof filename !== 'string' || filename.length > 240 || !/^[a-zA-Z0-9_.\-/]+$/.test(filename) || filename.startsWith('/') || filename.split('/').some(part => !part || part === '.' || part === '..' || part.startsWith('.') || part.endsWith('.') || /^(?:CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)/i.test(part))) throw new Error('Unsafe DDS entry path.');
    const key = filename.toLowerCase();
    if (seen.has(key) || key === 'dds-reference.json') throw new Error('Duplicate or reserved DDS entry path: ' + filename);
    seen.add(key);
    if (entry.encoding !== 'base64' || typeof entry.content !== 'string' || !Number.isSafeInteger(entry.bytes) || entry.bytes < 0 || entry.bytes > 16*1024*1024 || !/^[a-f0-9]{64}$/.test(entry.sha256)) throw new Error('Invalid DDS entry metadata: ' + filename);
    const bytes = Buffer.from(entry.content, 'base64');
    if (bytes.toString('base64') !== entry.content || bytes.length !== entry.bytes || sha256(bytes) !== entry.sha256) throw new Error('DDS file integrity check failed: ' + filename);
    const expected = manifest.files[index];
    if (!expected || expected.path !== filename || expected.bytes !== entry.bytes || expected.sha256 !== entry.sha256 || expected.encoding !== entry.encoding) throw new Error('Manifest file list does not match the DDS bundle.');
    totalBytes += bytes.length;
    if (totalBytes > 48*1024*1024) throw new Error('DDS payload is too large.');
    entries.push({filename, bytes});
  }
  if (manifest.files.length !== entries.length) throw new Error('Manifest file count does not match.');
  for (const filename of seen) {
    const parts = filename.split('/');
    for (let index=1; index<parts.length; index++) if (seen.has(parts.slice(0,index).join('/'))) throw new Error('DDS file and directory paths collide.');
  }
  const bundledInstaller = entries.find(entry => entry.filename === 'dds-install.js');
  if (!bundledInstaller || !bundledInstaller.bytes.equals(installerBytes)) throw new Error('The bundled DDS installer does not match the executed release installer.');
  const marker = Buffer.from(JSON.stringify({
    schemaVersion:1, designSystem:'DDS', version:bundle.version, packageType:'reference',
    referencePrepared:true, runtimeIntegrated:false, rulesRegistered:false,
    manifestSha256:sha256(manifestBytes), bundleSha256:manifest.bundle.sha256,
    files:manifest.files
  }, null, 2) + '\n');
  entries.push({filename:'DDS-REFERENCE.json', bytes:marker});

  const target = assertNoLinks(options['--target']);
  if (target === path.parse(target).root) throw new Error('A filesystem root cannot be the DDS target.');
  const expectedFiles = new Map(entries.map(entry => [entry.filename, entry.bytes]));
  const actualFiles = [];
  const inspect = (directory, prefix='') => {
    for (const entry of fs.readdirSync(directory, {withFileTypes:true})) {
      const relative = prefix+entry.name;
      if (entry.isSymbolicLink()) throw new Error('DDS target contains a symbolic link: ' + relative);
      if (entry.isDirectory()) inspect(path.join(directory,entry.name), relative+'/');
      else if (entry.isFile()) actualFiles.push(relative);
      else throw new Error('DDS target contains a non-regular file: ' + relative);
    }
  };
  const targetExists = fs.existsSync(target);
  if (targetExists) {
    if (!fs.statSync(target).isDirectory()) throw new Error('DDS target must be a directory.');
    inspect(target);
    for (const filename of actualFiles) {
      const expected = expectedFiles.get(filename);
      if (!expected || !readFile(path.join(target,filename)).equals(expected)) throw new Error('DDS target has existing changes; nothing was overwritten: ' + filename);
    }
    if (actualFiles.length && actualFiles.length !== expectedFiles.size) throw new Error('DDS target is partially populated; choose an empty directory or an identical complete reference.');
  }
  if (actualFiles.length === expectedFiles.size) {
    console.log('DDS ' + bundle.version + ' reference already prepared; reused without changes. Runtime integration and AI rule registration are separate steps.');
    return;
  }
  if (options.dryRun) {
    console.log('Verified DDS ' + bundle.version + ': ' + bundle.files.length + ' reference files, ' + totalBytes + ' bytes. Target: ' + target + '. Dry run: no files written.');
    return;
  }

  const parent = path.dirname(target);
  fs.mkdirSync(parent, {recursive:true});
  assertNoLinks(parent);
  if (targetExists) {
    // A caller-selected empty target is populated only after all references
    // validate. Exclusive writes prevent overwriting a concurrent change.
    for (const entry of entries) {
      const filename = path.join(target,entry.filename);
      fs.mkdirSync(path.dirname(filename), {recursive:true});
      assertNoLinks(path.dirname(filename));
      fs.writeFileSync(filename, entry.bytes, {flag:'wx'});
    }
  } else {
    const staging = fs.mkdtempSync(path.join(parent,'.dds-reference-'));
    // No recursive cleanup is performed. On interruption, the isolated staging
    // directory remains recoverable and the application target stays untouched.
    for (const entry of entries) {
      const filename = path.join(staging,entry.filename);
      fs.mkdirSync(path.dirname(filename), {recursive:true});
      fs.writeFileSync(filename, entry.bytes, {flag:'wx'});
    }
    assertNoLinks(parent);
    if (fs.existsSync(target)) throw new Error('DDS target appeared during preparation; staged references were preserved at ' + staging);
    fs.renameSync(staging,target);
  }
  console.log('Prepared DDS ' + bundle.version + ' reference at ' + target + '. No application CSS, dependencies, templates, or AI rules were changed. Read dds-setup.md before integration.');
})().catch(error => {console.error(error.message); process.exitCode=1;});
