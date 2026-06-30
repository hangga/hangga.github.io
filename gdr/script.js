// ============================================================
        // DATA
        // ============================================================
        const extensions = [
            "log", "txt", "conf", "cnf", "ini", "env",
            "yaml", "yml", "json", "xml",
            "sql", "db", "sqlite",
            "bak", "backup", "old", "orig",
            "zip", "tar", "gz", "7z", "rar",
            "swp", "git", "svn",
            "htaccess", "htpasswd",
            "pem", "key", "crt", "csr", "p12", "pfx", "sh",
            "pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx"
        ];

        const presets = {
            Secrets: ["env", "pem", "key", "p12", "pfx", "crt", "csr"],
            Backup: ["bak", "backup", "old", "orig", "zip", "gz", "tar", "7z", "rar"],
            Config: ["conf", "cnf", "ini", "yaml", "yml", "json", "xml", "htaccess", "htpasswd"],
            Database: ["sql", "db", "sqlite"],
            Admin: ["php", "asp", "aspx", "jsp", "do", "action"] // admin panel indicators
        };

        // ============================================================
        // STATE
        // ============================================================
        let selected = new Set(extensions);
        let lastQuery = '';

        // ============================================================
        // DOM REFS
        // ============================================================
        const container = document.getElementById('extensions');
        const domainInput = document.getElementById('domain');
        const keywordInput = document.getElementById('keyword');
        const inurlInput = document.getElementById('inurl');
        const intitleInput = document.getElementById('intitle');
        const intextInput = document.getElementById('intext');
        const allinurlInput = document.getElementById('allinurl');
        const allintitleInput = document.getElementById('allintitle');
        const cacheInput = document.getElementById('cache');
        const relatedInput = document.getElementById('related');
        const linkInput = document.getElementById('link');
        const infoInput = document.getElementById('info');
        const daterangeInput = document.getElementById('daterange');
        const queryPlaceholder = document.getElementById('queryPlaceholder');
        const queryText = document.getElementById('queryText');
        const copyBtn = document.getElementById('copyBtn');
        const domainDot = document.getElementById('domainDot');
        const domainHint = document.getElementById('domainHint');
        const selectedCount = document.getElementById('selectedCount');
        const totalExts = document.getElementById('totalExts');

        // ============================================================
        // RENDER CHIPS
        // ============================================================
        function render() {
            container.innerHTML = '';
            extensions.forEach(ext => {
                const active = selected.has(ext);
                const chip = document.createElement('button');
                chip.className = 'chip' + (active ? ' active' : '');
                chip.textContent = '.' + ext;
                chip.addEventListener('click', () => toggle(ext));
                container.appendChild(chip);
            });
            updateCounts();
        }

        function toggle(ext) {
            if (selected.has(ext)) selected.delete(ext);
            else selected.add(ext);
            render();
            buildQuery();
        }

        // ============================================================
        // PRESETS
        // ============================================================
        function applyPreset(list) {
            selected.clear();
            list.forEach(ext => { if (extensions.includes(ext)) selected.add(ext); });
            render();
            buildQuery();
            toast('Preset: ' + list.length + ' extensions', 'info');
        }

        function presetSecrets() { applyPreset(presets.Secrets); }

        function presetBackup() { applyPreset(presets.Backup); }

        function presetConfig() { applyPreset(presets.Config); }

        function presetDatabase() { applyPreset(presets.Database); }

        function presetAdmin() {
            // Admin panel dork: intitle:admin OR inurl:admin OR inurl:login
            applyPreset(presets.Admin);
            document.getElementById('intitle').value = 'admin';
            document.getElementById('inurl').value = 'admin OR login';
            buildQuery();
            toast('Admin panel dork loaded', 'info');
        }

        function selectAll() {
            extensions.forEach(ext => selected.add(ext));
            render();
            buildQuery();
            toast('All selected', 'info');
        }

        function clearAll() {
            selected.clear();
            render();
            buildQuery();
            toast('All cleared', 'info');
        }

        // ============================================================
        // COUNTS
        // ============================================================
        function updateCounts() {
            const total = extensions.length;
            const active = selected.size;
            selectedCount.textContent = active + ' selected';
            totalExts.textContent = total + ' exts';
        }

        // ============================================================
        // DOMAIN VALIDATION
        // ============================================================
        function validateDomain() {
            const raw = domainInput.value.trim();
            if (!raw) {
                domainDot.className = 'dot';
                domainHint.textContent = 'Enter a valid domain';
                return false;
            }
            const clean = raw.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
            const ok = /^[a-z0-9]([a-z0-9\-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9\-]*[a-z0-9])?)*\.[a-z]{2,}$/i.test(clean);
            if (ok) {
                domainDot.className = 'dot valid';
                domainHint.textContent = '✓ ' + clean;
            } else {
                domainDot.className = 'dot invalid';
                domainHint.textContent = '⚠️ invalid format';
            }
            return ok;
        }

        function getDomain() {
            const raw = domainInput.value.trim();
            if (!raw) return null;
            return raw.replace(/^https?:\/\//, '').replace(/\/.*$/, '') || null;
        }

        // ============================================================
        // BUILD QUERY (lengkap dengan semua operator)
        // ============================================================
        function buildQuery() {
            const domain = getDomain();
            const keyword = keywordInput.value.trim();
            const inurl = inurlInput.value.trim();
            const intitle = intitleInput.value.trim();
            const intext = intextInput.value.trim();
            const allinurl = allinurlInput.value.trim();
            const allintitle = allintitleInput.value.trim();
            const cache = cacheInput.value.trim();
            const related = relatedInput.value.trim();
            const link = linkInput.value.trim();
            const info = infoInput.value.trim();
            const daterange = daterangeInput.value.trim();
            const extList = [...selected];

            // Kalo ga ada domain, tampilin placeholder
            if (!domain) {
                queryText.style.display = 'none';
                queryPlaceholder.style.display = 'inline';
                copyBtn.style.display = 'none';
                lastQuery = '';
                return null;
            }

            let parts = [];

            // 1. site: (wajib)
            parts.push('site:' + domain);

            // 2. filetype / ext (dari chips)
            if (extList.length > 0) {
                // Gunakan filetype: untuk 1 ekstensi, ext: untuk multiple dengan OR
                if (extList.length === 1) {
                    parts.push('filetype:' + extList[0]);
                } else {
                    const extParts = extList.map(e => 'ext:' + e);
                    parts.push('(' + extParts.join(' OR ') + ')');
                }
            }

            // 3. inurl:
            if (inurl) parts.push('inurl:' + inurl);

            // 4. intitle:
            if (intitle) parts.push('intitle:' + intitle);

            // 5. intext:
            if (intext) parts.push('intext:' + intext);

            // 6. allinurl:
            if (allinurl) parts.push('allinurl:' + allinurl);

            // 7. allintitle:
            if (allintitle) parts.push('allintitle:' + allintitle);

            // 8. cache:
            if (cache) parts.push('cache:' + cache);

            // 9. related:
            if (related) parts.push('related:' + related);

            // 10. link:
            if (link) parts.push('link:' + link);

            // 11. info:
            if (info) parts.push('info:' + info);

            // 12. daterange:
            if (daterange) parts.push('daterange:' + daterange);

            // 13. keyword (free text)
            if (keyword) parts.push('"' + keyword + '"');

            // Gabungin
            let q = parts.join(' ');

            // Tampilin
            queryText.textContent = q;
            queryText.style.display = 'inline';
            queryPlaceholder.style.display = 'none';
            copyBtn.style.display = 'inline-block';
            copyBtn.classList.remove('copied');
            lastQuery = q;
            return q;
        }

        // ============================================================
        // ACTIONS
        // ============================================================
        function googleSearch() {
            if (!validateDomain()) {
                toast('Enter a valid domain', 'error');
                domainInput.focus();
                return;
            }
            const q = buildQuery();
            if (!q) {
                toast('Select at least one extension or fill an operator', 'error');
                return;
            }
            window.open('https://www.google.com/search?q=' + encodeURIComponent(q) + '&start=30', '_blank');
            toast('Searching Google…', 'success');
        }

        function copyQuery() {
            const text = queryText.textContent;
            if (!text) return;
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text).then(() => {
                    copyBtn.textContent = '✓ Copied!';
                    copyBtn.classList.add('copied');
                    toast('Copied!', 'success');
                    setTimeout(() => { copyBtn.textContent = '📋 Copy';
                        copyBtn.classList.remove('copied'); }, 1800);
                }).catch(() => fallbackCopy(text));
            } else {
                fallbackCopy(text);
            }
        }

        function fallbackCopy(text) {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand('copy');
                toast('Copied!', 'success'); } catch (e) { toast('Copy failed', 'error'); }
            document.body.removeChild(ta);
        }

        // ============================================================
        // SHORTCUTS (recon tools)
        // ============================================================
        function openCDX() {
            const d = getDomain();
            if (!d) { toast('Enter domain first', 'error'); return; }
            window.open('https://web.archive.org/cdx/search/cdx?url=*.' + d + '/*&collapse=urlkey&output=text&fl=original',
                '_blank');
            toast('CDX opened', 'info');
        }

        function openCalendar() {
            const d = getDomain();
            if (!d) { toast('Enter domain first', 'error'); return; }
            window.open('https://web.archive.org/web/*/https://' + d + '/*', '_blank');
            toast('Calendar opened', 'info');
        }

        function openCRT() {
            const d = getDomain();
            if (!d) { toast('Enter domain first', 'error'); return; }
            window.open('https://crt.sh/?q=%25.' + d, '_blank');
            toast('crt.sh opened', 'info');
        }

        function openURLScan() {
            const d = getDomain();
            if (!d) { toast('Enter domain first', 'error'); return; }
            window.open('https://urlscan.io/search/#domain:' + d, '_blank');
            toast('URLScan opened', 'info');
        }

        function openGithub() {
            window.open('https://github.com/search?q=path:**/.env%20MAIL_HOST=smtp.gmail.com&type=code', '_blank');
            toast('GitHub secrets search', 'info');
        }

        function openAll() {
            const d = getDomain();
            if (!d) { toast('Enter domain first', 'error'); return; }
            googleSearch();
            setTimeout(openCDX, 300);
            setTimeout(openCalendar, 600);
            setTimeout(openCRT, 900);
            setTimeout(openURLScan, 1200);
            setTimeout(openGithub, 1500);
            toast('Opening all…', 'success');
        }

        // ============================================================
        // TOAST
        // ============================================================
        function toast(msg, type) {
            type = type || 'info';
            const container = document.getElementById('toastContainer');
            const el = document.createElement('div');
            const icons = { success: '✅', error: '❌', info: '💬' };
            el.className = 'toast ' + type;
            el.innerHTML = '<span>' + (icons[type] || '💬') + '</span> ' + msg;
            container.appendChild(el);
            setTimeout(() => {
                el.classList.add('out');
                setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 250);
            }, 2500);
            el.addEventListener('click', () => {
                el.classList.add('out');
                setTimeout(() => { if (el.parentNode) el.parentNode.removeChild(el); }, 250);
            });
        }

        // ============================================================
        // KEYBOARD SHORTCUTS
        // ============================================================
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.shiftKey) {
                e.preventDefault();
                googleSearch();
                return;
            }
            if (e.ctrlKey && e.shiftKey) {
                const map = {
                    '1': openCDX,
                    '2': openCalendar,
                    '3': openCRT,
                    '4': openURLScan,
                    '5': openGithub,
                    '6': openAll,
                };
                const fn = map[e.key];
                if (fn) { e.preventDefault();
                    fn(); }
            }
        });

        // ============================================================
        // AUTO BUILD
        // ============================================================
        const allInputs = [domainInput, keywordInput, inurlInput, intitleInput, intextInput,
            allinurlInput, allintitleInput, cacheInput, relatedInput, linkInput, infoInput, daterangeInput
        ];

        allInputs.forEach(inp => {
            inp.addEventListener('input', () => {
                if (inp === domainInput) validateDomain();
                buildQuery();
            });
            inp.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    googleSearch();
                }
            });
        });

        // ============================================================
        // INIT
        // ============================================================
        render();
        validateDomain();
        buildQuery();
        if (!domainInput.value.trim()) setTimeout(() => domainInput.focus(), 100);
        console.log('⚡ GDR · Google Dork Recon v3 — 9 operators loaded');
        console.log('📖 Operators: site, filetype/ext, inurl, intitle, intext, allinurl, allintitle, cache, related, link, info, daterange');
    