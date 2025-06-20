async function  getCountries (url) {
    const response = await fetch(url);
    return await response.json();
}

const countriesBox = document.querySelector('.countries');
const countries = await getCountries('data.json');

const filterBtn = document.querySelector('.select-btn');
const optionsBox = document.querySelector('.options');

const searchInput = document.getElementById('search-country');
const searchZone = document.querySelector('.search-zone');
const main = document.querySelector('.countries');
const detailsBox = document.querySelector('.details');
const themeZone = document.querySelector('.theme-zone');


function showCountry(country) {
    const { name, capital, population, region, flags } = country;

    const countryBox = document.createElement('div');
    countryBox.classList.add('country');
    
    if (document.body.classList.contains('dark')) {
      countryBox.classList.add('dark');
    }
  
    countryBox.innerHTML = `
        <img src="${flags.svg}">
							
            <div class="country-info">
                    <h3>${name}</h3>
                    <p><span style="font-weight: bold;">Population:</span> ${population}</p>
                    <p><span style="font-weight: bold;">Region:</span> ${region}</p>
                    <p><span style="font-weight: bold;">Capital:</span> ${capital}</p>
            </div>
    `;

    countriesBox.appendChild(countryBox);
} 

function showAllCoutries() {
    countriesBox.innerHTML = ``;
    countries.forEach(element => {
        showCountry(element);
    });
}

showAllCoutries();

filterBtn.addEventListener('click', () => {
    optionsBox.classList.toggle('show');
});

document.addEventListener('click', (e) => {
    if (!optionsBox.contains(e.target) && !filterBtn.contains(e.target)) document.querySelector('.options').classList.remove('show');
});

document.querySelectorAll('li').forEach(li => {
    li.addEventListener('click', (e) => {
        countriesBox.innerHTML = ``;
        const opt = e.target.textContent.trim().toLowerCase();
    
        countries.forEach(country => {
            const { region } = country;
            if (region.toLowerCase() === opt) showCountry(country);
        });

        optionsBox.classList.remove('show');
    });
});

searchInput.addEventListener('input', () => {
    const nameInput = searchInput.value.trim().toLowerCase();
    countriesBox.innerHTML = ``;

    countries.forEach(country => {
        const { name } = country;
        if (name.toLowerCase().includes(nameInput)) showCountry(country);
    });
});

function getCountryNameByCode(code) {
    const country = countries.find(c => c.alpha3Code === code);
    return country ? country.name : null;
}

function showCountryDetails(country) {
    searchZone.classList.add('hidden');
    main.classList.add('hidden');
    detailsBox.classList.remove('hidden');

    const { name, nativeName, capital, population, region, subregion, flags, topLevelDomain, languages, currencies, borders } = country;
    detailsBox.innerHTML = `
        <div class="back-btn">
							<i class="fi fi-rr-arrow-left"></i>
							<p>Back</p>
						</div>

						<div class="country-detail">
							<img alt="Country Flag" src="${flags.svg}">

							<div class="country-info-detail">
								<h1>${name}</h1>

								<div class="info">
									<div>
										<p><span style="font-weight: bold;">Native Name: </span>${nativeName}</p>
										<p><span style="font-weight: bold;">Population: </span>${population}</p>
										<p><span style="font-weight: bold;">Region: </span>${region}</p>
										<p><span style="font-weight: bold;">Sub Region: </span>${subregion}</p>
										<p><span style="font-weight: bold;">Capital: </span>${capital}</p>
									</div>
									
									<div>
										<p><span style="font-weight: bold;">Top Level Domain: </span>${topLevelDomain}</p>
										<p><span style="font-weight: bold;">Currencies: </span>${currencies?.length ? currencies.map(c=> c.name).join(', ') : 'No currencies'}</p>
										<p><span style="font-weight: bold;">Languages: </span>${languages?.length ? languages.map (l => l.name).join(', ') : 'No languages'}</p>
									</div>
								</div>

								<div class="border-countries">
									<span style="font-weight: bold;">Border Countries: </span>

									<div class="border-list">
                  ${borders?.length
                    ? borders.map(border => `<span class="border-country">${getCountryNameByCode(border)}</span>`).join('')
                    : 'No border countries'}
								</div>
					
							</div>
						</div>
    `;
}

countriesBox.addEventListener('click', (e) => { 
  const countryElement = e.target.closest('.country');
  if (countryElement) {
    showCountryDetails(countries.find(country => country.name === countryElement.querySelector('h3').textContent));
  }
});

detailsBox.addEventListener('click', (e) => {
  if (e.target.closest('.back-btn')) {
    searchZone.classList.remove('hidden');
    main.classList.remove('hidden');
    detailsBox.classList.add('hidden');
  }
});

detailsBox.addEventListener('click', (e) => { 
  const borderCountryElement = e.target.closest('.border-country');
  
  if (borderCountryElement) {
    const borderCountryName = borderCountryElement.textContent;
    const borderCountry = countries.find(country => country.name === borderCountryName);
    
    if (borderCountry) {
      showCountryDetails(borderCountry);
    }
  }
});

themeZone.addEventListener('click', () => { 
  const themeIcon = document.getElementById('theme-icon');
  const themeText = document.querySelector('#theme');
  if (!document.body.classList.contains('dark')) {
    themeIcon.src = 'sun-icon.png';
    themeText.textContent = 'Light Mode';
  } else {
    themeIcon.src = 'dark-icon.png';
    themeText.textContent = 'Dark Mode';
  }

  document.body.classList.toggle('dark');
  document.querySelector('.header').classList.toggle('dark');

  document.querySelectorAll('.country').forEach(country => {
    country.classList.toggle('dark');
  });

  filterBtn.classList.toggle('dark');
  optionsBox.classList.toggle('dark');

  document.querySelectorAll('.option').forEach(option => {
    option.classList.toggle('dark');
  });

  document.querySelector('.search-box').classList.toggle('dark');
  document.querySelector('.back-btn')?.classList.toggle('dark');

  document.querySelectorAll('.border-country').forEach(borderCountry => {
    borderCountry.classList.toggle('dark');
  });
});

// MutationObserver: apply dark mode to new elements when dark mode is on
const observer = new MutationObserver(mutations => {
  if (!document.body.classList.contains('dark')) return;

  for (const mutation of mutations) {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType !== 1) return; 

      if (node.classList?.contains('back-btn')) {
        node.classList.add('dark');
      }

      if (node.classList?.contains('border-country')) {
        node.classList.add('dark');
      }

      if (node.classList?.contains('country')) {
        node.classList.add('dark');
      }

      node.querySelectorAll?.('.back-btn, .border-country, .country').forEach(el => {
        el.classList.add('dark');
      });
    });
  }
});

observer.observe(detailsBox, {
  childList: true,
  subtree: true
});