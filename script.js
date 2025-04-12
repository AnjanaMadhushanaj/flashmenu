fetch('menu.json')
  .then(response => response.json())
  .then(data => {
    const menuList = document.getElementById('menuList');
    data.forEach(menu => {
      const li = document.createElement('li');
      li.innerHTML = `
        <img src="${menu.image}" alt="${menu.item}" class="menu-img">
        <div class="menu-info">
          <strong>${menu.item}</strong><br/>
          <span>${menu.price}</span>
        </div>
      `;
      menuList.appendChild(li);
    });
  });
