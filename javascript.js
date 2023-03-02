/* ==========
  Version 1.1
  Nav Replacer for Squarespace 7.1
  This Code is licensed by Will-Myers.com 
========== */
(function(){
  if (document.querySelectorAll('[data-wm-plugin="new-nav"]').length !== 0) {
    let el = document.querySelector('[data-wm-plugin="new-nav"]'), 
        settingsEl;
    if (el.hasAttribute('data-nav-id')) {
      let id = el.getAttribute('data-nav-id');
      settingsEl = document.querySelector(`[data-nav-id="${id}"]:not([data-wm-plugin="new-nav"])`)
    } else {
      settingsEl = el;
    }
    
    //Hide Code Block
    try {
      settingsEl.closest('.sqs-block').classList.add('hide-block');
    } catch(err) {}


    let removeSiteTitle = settingsEl.getAttribute('data-site-title') == "remove" ? true : false,
        removeNavLinks = settingsEl.getAttribute('data-nav-links') == "remove" ? true : false,
        removeCta = settingsEl.getAttribute('data-cta') == "remove" ? true : false,
        removeSocial = settingsEl.getAttribute('data-social') == "remove" ? true : false;
    //Add Class to Header & Body

    //GET All CURRENT Elements
    let $header = document.querySelector('#header'),
        $siteTitle = $header.querySelector('.header-display-desktop #site-title'),
        $mobileSiteTitle = $header.querySelector('.header-display-mobile #site-title'),
        $siteTitleImg = $header.querySelector('.header-display-desktop .header-title img'),
        $mobileSiteTitleImg = $header.querySelector('.header-display-mobile .header-title img'),
        $cta = $header.querySelector('.header-actions-action--cta .btn'),
        $mobileCta = $header.querySelector('[data-folder="root"] .header-menu-cta .btn'),
        $socialDesktopEl = $header.querySelector('.header-actions-action--social'),
        $socialMobileEls = $header.querySelectorAll('[data-folder="root"] .header-menu-actions > *'),
        $navItemsDesktopEl = $header.querySelector('.header-nav-list'),
        $navItemsDesktopMobileEl = $header.querySelector('.header-display-mobile .header-nav-list'),
        $navItemsMobileEl = $header.querySelector('.header-menu-nav-list'),
        $socialsDesktopEl = $header.querySelector('.header-actions-action--social'),
        $socialsMobileEl = $header.querySelector('.header-menu-actions');
        
    //Remove Link Items
    function removeLinkItems() {
      $navItemsDesktopEl.querySelectorAll('.header-nav-item').forEach(e => {
        if (e.querySelector('[href="/secondary-nav"]') == null) {
          e.remove()
        }
      });
      $navItemsDesktopMobileEl.querySelectorAll('.header-nav-item').forEach(e => {
        if (e.querySelector('[href="/secondary-nav"]') == null) {
          e.remove()
        }
      });
      $navItemsMobileEl.querySelectorAll('[data-folder="root"] .header-menu-nav-item').forEach(e => {
        if (e.querySelector('[href="/secondary-nav"]') == null) {
          if (!e.classList.contains('user-accounts-link')){
            e.remove()
          } else {
            e.insertAdjacentHTML('beforebegin', `<style>
              .header-menu-nav-folder-content .user-accounts-link{order: 1}
            </style>`)
          }
        }
      });
      $navItemsMobileEl.querySelectorAll('[data-folder]:not([data-folder="root"])').forEach(e => {
        if (e.querySelector('[href="/secondary-nav"]') == null) {
          e.remove()
        }
      });
    }

    //Get All New Links
    //Replace Main Nav Links
    function buildLink(text, href, type, newWindow) {
      let linkWrapper = document.createElement('div'),
          linkEl = document.createElement('a'),
          mobileWrapper = document.createElement('div'),
          mobileLink = document.createElement('a');
      //console.log(text, newWindow);
      if (newWindow) {
        linkEl.target = '_blank';
        mobileLink.target = '_blank'
      }

      linkWrapper.append(linkEl);
      mobileWrapper.append(mobileLink);
      if (type === 'collection' || null) {
        linkWrapper.classList.add('header-nav-item--collection', 'header-nav-item');
        linkEl.href = href;
        linkEl.textContent = text;
        if (newWindow) {
          linkEl.target = '_blank'
        }
        mobileWrapper.classList.add('container', 'header-menu-nav-item', 'header-menu-nav-item--collection');
        mobileLink.href = href;
        mobileLink.textContent = text;
        if (newWindow) {
          mobileLink.target = '_blank'
        }
      } else if (type == "dropdown") {
        let folderEl = document.createElement('div');
        folderEl.classList.add('header-nav-folder-content');
        linkWrapper.append(folderEl);
        linkWrapper.classList.add('header-nav-item--folder', 'header-nav-item');
        linkEl.classList.add('header-nav-folder-title');
        linkEl.href = 'javascript:void(0)';
        linkEl.textContent = text;
        
        //Build Mobile Link
        let spanHidden = document.createElement('span'),
            spanText = document.createElement('span'),
            spanArrow = document.createElement('span');
        mobileWrapper.classList.add('container', 'header-menu-nav-item');
        mobileLink.href = href;
        mobileLink.setAttribute('data-folder-id', href);
        mobileLink.append(spanHidden);
        mobileLink.append(spanText);
        mobileLink.append(spanArrow);
        spanHidden.textContent = "Folder:";
        spanHidden.classList.add('visually-hidden');
        spanText.textContent = text;
        spanArrow.classList.add('chevron', 'chevron--right');
        
        //Build Mobile Folder Container
        let newFolder = document.createElement('div'),
            contentContainer = document.createElement('div');
        newFolder.setAttribute('data-folder', href);
        newFolder.classList.add('header-menu-nav-folder');
        contentContainer.classList.add('header-menu-nav-folder-content');
        newFolder.append(contentContainer);
        $navItemsMobileEl.append(newFolder);
        
        let folderNavControls = document.createElement('div'),
            folderNavControlsEl = document.createElement('a'),
            folderNavControlsSpanArrow = document.createElement('span'),
            folderNavControlsSpanText = document.createElement('span');
        folderNavControls.classList.add('header-menu-controls', 'container', 'header-menu-nav-item');
        folderNavControlsEl.classList.add('header-menu-controls-control', 'header-menu-controls-control--active');
        folderNavControlsEl.tabIndex = "-1";
        folderNavControlsEl.href = "/";
        folderNavControlsEl.setAttribute('data-action', 'back');
        folderNavControlsSpanArrow.classList.add('chevron', 'chevron--left');
        folderNavControlsSpanText.textContent = "Back";
        folderNavControlsEl.append(folderNavControlsSpanArrow);
        folderNavControlsEl.append(folderNavControlsSpanText);
        folderNavControls.append(folderNavControlsEl);
        contentContainer.append(folderNavControls);
      } else if (type == "dropdown-link") {
        linkWrapper.classList.add('header-nav-folder-item');
        linkEl.href = href;
        linkEl.textContent = text;
        if (newWindow) {
          linkEl.target = '_blank'
        }
      } else if (type == 'mobile-folder-item') {
        linkWrapper.classList.add('container', 'header-menu-nav-item');
        linkEl.href = href;
        linkEl.textContent = text;
        if (newWindow) {
          linkEl.target = '_blank'
        }
      }
      return [linkWrapper, mobileWrapper];
    }

    let newSocialLinks = settingsEl.querySelectorAll(':scope > .social');
    if (newSocialLinks.length) {
      newSocialLinks.forEach(social => {
        let href = social.getAttribute('href'),
            url = new URL(href),
            desktopSocial = $socialsDesktopEl.querySelector(`[href*="${url.host}"]`),
            mobileSocial = $socialsMobileEl.querySelector(`[href*="${url.host}"]`);
        if (desktopSocial) {
          desktopSocial.href = social.getAttribute('href');
          mobileSocial.href = social.getAttribute('href');
          desktopSocial.classList.add('new-social');
          mobileSocial.parentElement.classList.add('new-social');
        } 
      });
      
      //Remove Others
      let otherSocials = $socialsDesktopEl.querySelectorAll('.icon:not(.new-social)'), 
          otherMobileSocials = $socialsMobileEl.querySelectorAll('.header-menu-actions-action--social:not(.new-social)');
      otherSocials.forEach(el => el.remove())
      otherMobileSocials.forEach(el => el.remove())
    }

    let newNavLinks = settingsEl.querySelectorAll(':scope > div:not(.new-site-title):not(.new-cta):not(.new-mobile-title):not(.social)');
    if (newNavLinks.length !== 0) {
      removeLinkItems();
      newNavLinks.forEach(link => {
        let text = link.innerHTML,
            href = link.getAttribute('href'),
            dropdown = !!link.classList.contains('new-nav-dropdown'),
            linkWrapper,
            newWindow = link.hasAttribute('data-new-window') || link.getAttribute('target') == '_blank';
        if (!dropdown) {
          linkWrapper = buildLink(text, href, 'collection', newWindow);
        } else if (dropdown) {
          let count = $navItemsMobileEl.querySelectorAll('[data-folder]').length;
          text = link.getAttribute('data-title');
          href = 'wm-folder-' + count;
          linkWrapper = buildLink(text, href, 'dropdown', newWindow);
          let folder = linkWrapper[0].querySelector('.header-nav-folder-content');
          link.querySelectorAll('div').forEach(subLink => {
            let subText = subLink.textContent,
                subHref = subLink.getAttribute('href'),
                subNewWindow = subLink.hasAttribute('data-new-window') || subLink.getAttribute('target') == '_blank';
            let newFolderItem = buildLink(subText, subHref, 'dropdown-link', subNewWindow);
            folder.append(newFolderItem[0])
            let newMobileFolderItem = buildLink(subText, subHref, 'mobile-folder-item');
            $navItemsMobileEl.querySelector('[data-folder="' + href + '"] .header-menu-nav-folder-content').append(newMobileFolderItem[0])
          })
        }
        $navItemsDesktopEl.append(linkWrapper[0])
        $navItemsDesktopMobileEl.append(linkWrapper[0].cloneNode(true))
        $navItemsMobileEl.querySelector('[data-folder="root"] .header-menu-nav-folder-content').append(linkWrapper[1])
      })

      document.querySelectorAll('.header-menu-controls-control[data-action="back"]').forEach(btn => {
        btn.addEventListener('click', function(e){
          e.preventDefault();
          e.stopPropagation();
          document.querySelector('[data-folder="root"]').classList.remove('header-menu-nav-folder--open');
          $navItemsMobileEl.querySelector('[data-folder].header-menu-nav-folder--active:not([data-folder="root"])').classList.remove('header-menu-nav-folder--active')
        })
      })

      document.querySelectorAll('[data-folder="root"] [data-folder-id]').forEach(btn => {
        btn.addEventListener('click', function(e){
          e.preventDefault();
          e.stopPropagation();
          let id = btn.getAttribute('data-folder-id');
          document.querySelector('[data-folder="root"]').classList.add('header-menu-nav-folder--open');
          $navItemsMobileEl.querySelector('[data-folder="' + id + '"]').classList.add('header-menu-nav-folder--active')
        })
      })
    }

    //Replace CTA
    let newCta = settingsEl.querySelector('.new-cta');
    if (newCta) {
      //Build CTA if Not Present
      if (!$cta){
        let $ctaContainer = document.createElement('div'),
            $mobileCTAContainer = document.createElement('div');
        $cta = document.createElement('a');
        $mobileCta = document.createElement('a');
        $ctaContainer.classList.add('header-actions-action', 'header-actions-action--cta');
        $mobileCTAContainer.classList.add('header-menu-cta');
        $cta.classList.add('btn', 'btn--border');
        $mobileCta.classList.add('btn');
        $ctaContainer.append($cta);
        $mobileCTAContainer.append($mobileCta);
        let desktopActions = document.querySelector('.header-display-desktop .header-actions'),
            mobileActions = document.querySelector('[data-folder="root"]')
        desktopActions.append($ctaContainer)
        mobileActions.append($mobileCTAContainer)
      }
      let text = newCta.textContent,
          href = newCta.getAttribute('href');
      $cta.textContent = text;
      $cta.href = href;
      $mobileCta.textContent = text;
      $mobileCta.href = href;
    }


    //Replace Site Title
    let newSiteTitle = settingsEl.querySelector('.new-site-title');
    if (newSiteTitle) {
      let text = newSiteTitle.textContent,
          desktopImgSrc = newSiteTitle.getAttribute('data-src-url'),
          mobileImgSrc = newSiteTitle.getAttribute('data-mobile-src-url') || desktopImgSrc,
          href = newSiteTitle.getAttribute('href');

      /*Replace Text if there is any*/
      if (text && $siteTitle) {
        $siteTitle.textContent = text;
        $mobileSiteTitle.textContent = text;
      }
      
      /*Replace URL on either the site Title Text or Image*/
      if (href && $siteTitle){
        $siteTitle.href = href;
        $mobileSiteTitle.href = href;
      }
      if (href && $siteTitleImg){ 
        $siteTitleImg.closest('a').href = href;
        $mobileSiteTitleImg.closest('a').href = href;
      }

      function newLogoLoader() {
        $siteTitleImg = $header.querySelectorAll('.header-title-logo source');
        $mobileSiteTitleImg = $header.querySelectorAll('.header-mobile-logo source');
        $siteTitleImg.forEach(el => {
          el.srcset = desktopImgSrc;
        })
        $mobileSiteTitleImg.forEach(el => {
          el.srcset = mobileImgSrc;
        })
      }
      
      /*Replace Image*/
      if (desktopImgSrc && $siteTitleImg) {
        $siteTitleImg.src = desktopImgSrc;
        $mobileSiteTitleImg.src = mobileImgSrc;
        
        if ($header.querySelector('.header-title-logo source')) {
          newLogoLoader();
        }
        //window.addEventListener('load', setImage);
      }
    }

    if (document.querySelector('.header-nav-item--collection [href="#sqsp-account"]')) addAccountBtnListener();
    //Add account Button Event Listener
    function addAccountBtnListener() {
      function setListener() {
        let btns = document.querySelectorAll('[href="#sqsp-account"]'),
            accountBtn = document.querySelector('.user-accounts-text-link');

        function openAccountPanel(e){
          e.preventDefault();
          e.stopPropagation();
          if (accountBtn) accountBtn.click();
        }

        btns.forEach(btn => btn.addEventListener('click', openAccountPanel));
      };
      window.addEventListener('DOMContentLoaded', setListener)
    }


    //Add Active Class if on Page
    let activeClass = 'header-nav-item--active',
        pathName = window.location.pathname,
        newLinks = document.querySelectorAll('.header-nav-list .header-nav-item');
    newLinks.forEach(link => {
      let href = link.querySelector('a:not(.header-nav-folder-title)') || link.querySelector('a');
      if (pathName == href.getAttribute('href')) {
        link.classList.add(activeClass);
      }
    })

    //Loaded
    document.querySelector('body').classList.add('new-nav-loaded');
    let style = document.createElement('style'), 
        css = `.new-nav-loaded #header .header-display-desktop, .new-nav-loaded #header .header-display-mobile{
  transition: opacity .3s ease,
    visibility 0s ease,
    transform .3s ease;
  opacity: 1;
  visibility:visible;
  transform: unset;
}`;
    style.setAttribute('type', 'text/css');
    style.appendChild(document.createTextNode(css));
    document.head.prepend(style);
  }
}())
