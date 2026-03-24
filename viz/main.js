console.log('main.js loaded');

const UNSPLASH_KEY = '-oJeiHbvuyhxqYC0KJm-ozCsnskQLyahqb36KR-GOOw';

function fetchCuisineImage(cuisine) {
  const query = cuisine.replace('_', ' ') + ' food dish';
  fetch(`https://api.unsplash.com/photos/random?query=${query}&client_id=${UNSPLASH_KEY}`)
    .then(res => res.json())
    .then(data => {
      const img = document.getElementById('cuisine-image');
      img.src = data.urls.regular;
      img.alt = cuisine;
      img.style.display = 'block';
    })
    .catch(err => console.log('Image fetch failed:', err));
}

Promise.all([
  d3.json('data/processed/cuisine_counts.json'),
  d3.json('data/processed/top_ingredients.json'),
  d3.json('data/processed/shared_ingredients.json')
]).then(([cuisineCounts, topIngredients, sharedIngredients]) => {

  // TOOLTIP
  const tooltip = document.getElementById('tooltip');

  // =====================
  // SECTION 1: BAR CHART
  // =====================
  const barMargin = { top: 20, right: 30, bottom: 100, left: 60 };
  const barWidth = 860 - barMargin.left - barMargin.right;
  const barHeight = 400 - barMargin.top - barMargin.bottom;

  const barSvg = d3.select('#bar-chart')
    .append('svg')
    .attr('width', barWidth + barMargin.left + barMargin.right)
    .attr('height', barHeight + barMargin.top + barMargin.bottom)
    .append('g')
    .attr('transform', `translate(${barMargin.left},${barMargin.top})`);

  const x = d3.scaleBand()
    .domain(cuisineCounts.map(d => d.cuisine))
    .range([0, barWidth])
    .padding(0.3);

  const y = d3.scaleLinear()
    .domain([0, d3.max(cuisineCounts, d => d.count)])
    .range([barHeight, 0]);

  barSvg.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0,${barHeight})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .attr('transform', 'rotate(-40)')
    .style('text-anchor', 'end');

  barSvg.append('g')
    .attr('class', 'axis')
    .call(d3.axisLeft(y));

  const bars = barSvg.selectAll('.bar')
    .data(cuisineCounts)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', d => x(d.cuisine))
    .attr('y', barHeight)
    .attr('width', x.bandwidth())
    .attr('height', 0)
    .on('mouseover', function(event, d) {
      tooltip.style.display = 'block';
      tooltip.innerHTML = `<strong>${d.cuisine.replace('_', ' ')}</strong><br/>${d.count} recipes`;
      tooltip.style.left = (event.clientX + 10) + 'px';
      tooltip.style.top = (event.clientY - 28) + 'px';
    })
    .on('mouseout', function() {
      tooltip.style.display = 'none';
    });

  bars.transition()
    .duration(800)
    .delay((d, i) => i * 50)
    .attr('y', d => y(d.count))
    .attr('height', d => barHeight - y(d.count));

  // =====================
  // SECTION 2: INGREDIENTS
  // =====================
  const cuisines = Object.keys(topIngredients);

  d3.select('#cuisine-selector')
    .selectAll('.cuisine-btn')
    .data(cuisines)
    .enter()
    .append('button')
    .attr('class', 'cuisine-btn')
    .text(d => d.replace('_', ' '))
    .on('click', function(event, d) {
      d3.selectAll('.cuisine-btn').classed('active', false);
      d3.select(this).classed('active', true);
      fetchCuisineImage(d);
      updateIngredientChart(d);
    });

  const ingMargin = { top: 20, right: 30, bottom: 40, left: 150 };
  const ingWidth = 860 - ingMargin.left - ingMargin.right;
  const ingHeight = 350 - ingMargin.top - ingMargin.bottom;

  const ingSvg = d3.select('#ingredient-chart')
    .append('svg')
    .attr('width', ingWidth + ingMargin.left + ingMargin.right)
    .attr('height', ingHeight + ingMargin.top + ingMargin.bottom)
    .append('g')
    .attr('transform', `translate(${ingMargin.left},${ingMargin.top})`);

  function updateIngredientChart(cuisine) {
    const data = topIngredients[cuisine];

    const ix = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count)])
      .range([0, ingWidth]);

    const iy = d3.scaleBand()
      .domain(data.map(d => d.ingredient))
      .range([0, ingHeight])
      .padding(0.2);

    ingSvg.selectAll('*').remove();

    ingSvg.append('g')
      .attr('class', 'axis')
      .call(d3.axisLeft(iy));

    ingSvg.append('g')
      .attr('class', 'axis')
      .attr('transform', `translate(0,${ingHeight})`)
      .call(d3.axisBottom(ix).ticks(5));

    ingSvg.selectAll('.ing-bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('y', d => iy(d.ingredient))
      .attr('height', iy.bandwidth())
      .attr('width', 0)
      .transition()
      .duration(600)
      .delay((d, i) => i * 60)
      .attr('width', d => ix(d.count));
  }

  updateIngredientChart('italian');
  fetchCuisineImage('italian');
  d3.selectAll('.cuisine-btn').filter(d => d === 'italian').classed('active', true);

  // =====================
  // SECTION 3: SHARED INGREDIENTS
  // =====================
  const sharedData = sharedIngredients
    .sort((a, b) => b.cuisine_count - a.cuisine_count)
    .slice(0, 15);

  const shMargin = { top: 20, right: 30, bottom: 40, left: 160 };
  const shWidth = 860 - shMargin.left - shMargin.right;
  const shHeight = 400 - shMargin.top - shMargin.bottom;

  const shSvg = d3.select('#shared-chart')
    .append('svg')
    .attr('width', shWidth + shMargin.left + shMargin.right)
    .attr('height', shHeight + shMargin.top + shMargin.bottom)
    .append('g')
    .attr('transform', `translate(${shMargin.left},${shMargin.top})`);

  const shX = d3.scaleLinear()
    .domain([0, d3.max(sharedData, d => d.cuisine_count)])
    .range([0, shWidth]);

  const shY = d3.scaleBand()
    .domain(sharedData.map(d => d.ingredient))
    .range([0, shHeight])
    .padding(0.2);

  shSvg.append('g')
    .attr('class', 'axis')
    .call(d3.axisLeft(shY));

  shSvg.append('g')
    .attr('class', 'axis')
    .attr('transform', `translate(0,${shHeight})`)
    .call(d3.axisBottom(shX).ticks(5));

  shSvg.selectAll('.shared-bar')
    .data(sharedData)
    .enter()
    .append('rect')
    .attr('class', 'shared-bar')
    .attr('x', 0)
    .attr('y', d => shY(d.ingredient))
    .attr('height', shY.bandwidth())
    .attr('width', 0)
    .transition()
    .duration(600)
    .delay((d, i) => i * 60)
    .attr('width', d => shX(d.cuisine_count));

});