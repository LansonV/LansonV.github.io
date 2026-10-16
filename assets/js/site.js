/*
 * Site behaviour. No dependencies.
 *
 * - Theme toggle (light / dark, remembered per browser)
 * - Mobile navigation menu
 * - Header border once the page scrolls
 * - Click-to-play YouTube embeds (.video[data-yt])
 * - Blog index: tag filter + search, synced to ?tag= and ?q= in the URL
 * - Blog post: previous / next links, read from the cards on blog/index.html
 */
(function () {
	'use strict';

	var root = document.documentElement;

	/* ---------- Theme ---------- */
	function currentTheme() {
		var set = root.getAttribute('data-theme');
		if (set) return set;
		return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
	}

	document.querySelectorAll('.theme-toggle').forEach(function (btn) {
		btn.addEventListener('click', function () {
			var next = currentTheme() === 'dark' ? 'light' : 'dark';
			root.setAttribute('data-theme', next);
			try { localStorage.setItem('theme', next); } catch (e) {}
		});
	});

	/* ---------- Mobile nav ---------- */
	var navToggle = document.querySelector('.nav-toggle');
	var nav = document.getElementById('site-nav');
	if (navToggle && nav) {
		var setOpen = function (open) {
			nav.classList.toggle('is-open', open);
			navToggle.setAttribute('aria-expanded', String(open));
		};
		navToggle.addEventListener('click', function () {
			setOpen(navToggle.getAttribute('aria-expanded') !== 'true');
		});
		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape' && nav.classList.contains('is-open')) {
				setOpen(false);
				navToggle.focus();
			}
		});
		document.addEventListener('click', function (e) {
			if (nav.classList.contains('is-open') && !nav.contains(e.target) && !navToggle.contains(e.target)) setOpen(false);
		});
	}

	/* ---------- Header scroll state ---------- */
	var header = document.querySelector('.site-header');
	if (header) {
		var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
	}

	/* ---------- YouTube: load the player only when clicked ---------- */
	document.addEventListener('click', function (e) {
		var link = e.target.closest && e.target.closest('.video[data-yt]');
		if (!link || e.metaKey || e.ctrlKey || e.shiftKey) return;
		e.preventDefault();
		var frame = document.createElement('iframe');
		frame.src = 'https://www.youtube-nocookie.com/embed/' + encodeURIComponent(link.getAttribute('data-yt')) + '?autoplay=1&rel=0';
		frame.title = link.getAttribute('aria-label') || 'YouTube video';
		frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
		frame.allowFullscreen = true;
		var box = document.createElement('div');
		box.className = 'video';
		box.appendChild(frame);
		link.replaceWith(box);
		frame.focus();
	});

	/* ---------- Helpers ---------- */
	function slugify(s) {
		return String(s).toLowerCase().trim().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
	}

	function cardTags(card) {
		return Array.prototype.map.call(card.querySelectorAll('.tags .tag'), function (a) {
			return { slug: slugify(a.textContent), name: a.textContent.trim() };
		});
	}

	/* ---------- Blog index: tags + search ---------- */
	var list = document.getElementById('post-list');
	if (list) initBlogIndex(list);

	function initBlogIndex(list) {
		var cards = Array.prototype.slice.call(list.querySelectorAll('.card'));
		var filterEl = document.getElementById('tag-filter');
		var searchEl = document.getElementById('post-search');
		var statusEl = document.getElementById('filter-status');
		var emptyEl = document.getElementById('empty-state');

		// Index each card once: its tags and the text search runs against.
		var tagNames = {};
		var tagCounts = {};
		cards.forEach(function (card) {
			var tags = cardTags(card);
			card._tags = tags.map(function (t) { return t.slug; });
			tags.forEach(function (t) {
				tagNames[t.slug] = t.name;
				tagCounts[t.slug] = (tagCounts[t.slug] || 0) + 1;
			});
			card._text = (card.textContent || '').toLowerCase().replace(/\s+/g, ' ');
		});

		// Build the tag bar from the tags actually used on the cards, most-used first.
		var slugs = Object.keys(tagCounts).sort(function (a, b) {
			return tagCounts[b] - tagCounts[a] || tagNames[a].localeCompare(tagNames[b]);
		});

		function tagLink(slug, label, count) {
			var li = document.createElement('li');
			var a = document.createElement('a');
			a.href = slug ? '?tag=' + slug : './';
			a.setAttribute('data-tag', slug);
			a.appendChild(document.createTextNode(label + ' '));
			var c = document.createElement('span');
			c.className = 'count';
			c.textContent = count;
			a.appendChild(c);
			li.appendChild(a);
			return li;
		}

		if (filterEl) {
			filterEl.appendChild(tagLink('', 'All', cards.length));
			slugs.forEach(function (slug) { filterEl.appendChild(tagLink(slug, tagNames[slug], tagCounts[slug])); });
			filterEl.hidden = false;
		}

		var state = readUrl();

		function readUrl() {
			var params = new URLSearchParams(window.location.search);
			return { tag: slugify(params.get('tag') || ''), q: (params.get('q') || '').trim() };
		}

		function writeUrl(push) {
			var params = new URLSearchParams();
			if (state.tag) params.set('tag', state.tag);
			if (state.q) params.set('q', state.q);
			var qs = params.toString();
			var url = window.location.pathname + (qs ? '?' + qs : '') + window.location.hash;
			try { window.history[push ? 'pushState' : 'replaceState'](null, '', url); } catch (e) {}
		}

		function render() {
			var terms = state.q.toLowerCase().split(/\s+/).filter(Boolean);
			var shown = 0;
			cards.forEach(function (card) {
				var tagOk = !state.tag || card._tags.indexOf(state.tag) !== -1;
				var textOk = terms.every(function (t) { return card._text.indexOf(t) !== -1; });
				card.hidden = !(tagOk && textOk);
				if (!card.hidden) shown++;
			});

			if (filterEl) {
				filterEl.querySelectorAll('a').forEach(function (a) {
					var active = a.getAttribute('data-tag') === state.tag;
					if (active) a.setAttribute('aria-current', 'true');
					else a.removeAttribute('aria-current');
				});
			}

			if (searchEl && searchEl.value !== state.q) searchEl.value = state.q;

			if (statusEl) {
				statusEl.textContent = '';
				if (state.tag || state.q) {
					var span = document.createElement('span');
					var label = shown === 1 ? '1 post' : shown + ' posts';
					var strong = document.createElement('strong');
					strong.textContent = label;
					span.appendChild(strong);
					if (state.tag) span.appendChild(document.createTextNode(' tagged “' + (tagNames[state.tag] || state.tag) + '”'));
					if (state.q) span.appendChild(document.createTextNode(' matching “' + state.q + '”'));
					statusEl.appendChild(span);
					var clear = document.createElement('button');
					clear.type = 'button';
					clear.textContent = 'Clear filters';
					clear.addEventListener('click', function () {
						state = { tag: '', q: '' };
						writeUrl(true);
						render();
						if (searchEl) searchEl.focus();
					});
					statusEl.appendChild(clear);
				}
			}

			if (emptyEl) emptyEl.hidden = shown !== 0;

			document.title = (state.tag && tagNames[state.tag] ? tagNames[state.tag] + ' · ' : '') + 'The Lanson Logs';
		}

		if (filterEl) {
			filterEl.addEventListener('click', function (e) {
				var a = e.target.closest('a[data-tag]');
				if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
				e.preventDefault();
				var slug = a.getAttribute('data-tag');
				state.tag = state.tag === slug ? '' : slug;
				writeUrl(true);
				render();
			});
		}

		// Tag chips on the cards filter in place too, instead of reloading the page.
		list.addEventListener('click', function (e) {
			var a = e.target.closest('.tags a.tag');
			if (!a || e.metaKey || e.ctrlKey || e.shiftKey) return;
			e.preventDefault();
			state.tag = slugify(a.textContent);
			writeUrl(true);
			render();
			var top = document.getElementById('blog-toolbar');
			if (top) top.scrollIntoView({ block: 'start' });
		});

		if (searchEl) {
			var timer;
			searchEl.addEventListener('input', function () {
				clearTimeout(timer);
				timer = setTimeout(function () {
					state.q = searchEl.value.trim();
					writeUrl(false);
					render();
				}, 120);
			});
			searchEl.addEventListener('keydown', function (e) {
				if (e.key === 'Escape' && searchEl.value) {
					searchEl.value = '';
					state.q = '';
					writeUrl(false);
					render();
				}
			});
			document.addEventListener('keydown', function (e) {
				var tag = (e.target.tagName || '').toLowerCase();
				if (e.key === '/' && tag !== 'input' && tag !== 'textarea' && !e.target.isContentEditable) {
					e.preventDefault();
					searchEl.focus();
				}
			});
		}

		window.addEventListener('popstate', function () {
			state = readUrl();
			render();
		});

		render();
	}

	/* ---------- Blog post: previous / next ---------- */
	var postNav = document.getElementById('post-nav');
	if (postNav && window.fetch && window.DOMParser) {
		var bare = function (h) { return (h || '').split(/[?#]/)[0].replace(/\.html$/, ''); };
		var here = bare(window.location.pathname.split('/').pop());
		fetch('index.html')
			.then(function (r) { return r.ok ? r.text() : Promise.reject(); })
			.then(function (html) {
				var doc = new DOMParser().parseFromString(html, 'text/html');
				var posts = Array.prototype.map.call(doc.querySelectorAll('#post-list .card-title a'), function (a) {
					return { href: a.getAttribute('href'), title: a.textContent.trim() };
				});
				var i = posts.findIndex(function (p) { return bare(p.href) === here; });
				if (i === -1) return;
				// The index is newest first, so the "next" (newer) post sits above this one.
				var newer = posts[i - 1];
				var older = posts[i + 1];
				function link(p, cls, label) {
					var a = document.createElement('a');
					a.href = p.href;
					a.className = cls;
					var s = document.createElement('small');
					s.textContent = label;
					var t = document.createElement('span');
					t.textContent = p.title;
					a.appendChild(s);
					a.appendChild(t);
					return a;
				}
				if (older) postNav.appendChild(link(older, 'prev', '← Older post'));
				if (newer) postNav.appendChild(link(newer, 'next', 'Newer post →'));
				if (older || newer) postNav.hidden = false;
			})
			.catch(function () {});
	}
})();
