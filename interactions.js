(() => {
  const nav = document.querySelector('.floating-nav');
  const links = [...nav.querySelectorAll('a')];
  let active = links[0];
  const controllers = [];
  function slider(group, items, resting) {
    const pill = document.createElement('span');
    pill.className = 'sliding-highlight';
    pill.setAttribute('aria-hidden', 'true');
    group.prepend(pill);
    let hovered = null;
    const move = (target) => {
      pill.style.opacity = target ? '1' : '0';
      if (!target) return;
      pill.style.width = `${target.offsetWidth}px`;
      pill.style.height = `${target.offsetHeight}px`;
      pill.style.transform = `translate(${target.offsetLeft}px, ${target.offsetTop}px)`;
    };
    const reset = () => move(hovered || (group.contains(document.activeElement) && items.includes(document.activeElement) ? document.activeElement : resting()));
    items.forEach(item => {
      item.addEventListener('pointerenter', event => { if (event.pointerType !== 'touch') { hovered = item; move(item); } });
      item.addEventListener('focus', () => move(item));
    });
    group.addEventListener('pointerleave', () => { hovered = null; reset(); });
    group.addEventListener('focusout', () => requestAnimationFrame(reset));
    new ResizeObserver(reset).observe(group);
    reset();
    return reset;
  }
  controllers.push(slider(nav, links, () => active));
  const actions = document.querySelector('.header-actions');
  controllers.push(slider(actions, [...actions.querySelectorAll('a,button')], () => null));
  function setActive(link) {
    active = link;
    links.forEach(item => {
      item.classList.toggle('is-active', item === link);
      if (item === link) item.setAttribute('aria-current', 'location');
      else item.removeAttribute('aria-current');
    });
    controllers[0]();
  }
  const sections = links.filter(link => link.hash !== '#contact').map(link => ({ link, element: document.querySelector(link.hash) }));
  let frame = false;
  function update() {
    frame = false;
    const threshold = innerHeight * .34;
    const current = sections.filter(section => section.element.getBoundingClientRect().top <= threshold).pop();
    setActive(current ? current.link : links[0]);
  }
  window.addEventListener('scroll', () => { if (!frame) { frame = true; requestAnimationFrame(update); } }, { passive: true });
  links.forEach(link => link.addEventListener('click', () => setActive(link)));
  update();
})();
