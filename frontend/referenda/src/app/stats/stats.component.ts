import {Component, Inject, OnInit} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import * as d3 from 'd3';

import { Law } from '../_models';
import { LawService } from '../_services';
import {DOCUMENT} from "@angular/common";


@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  laws: Law[] = [];
  totalLaws: number = this.laws.length;
  maxPartyLaws = 1;
  maxPartyResults = 1;
  institutionProposals: any[] = [];
  ccaaProposals: any[] = [];
  institutionVoted: any[] = [];
  ccaaVoted: any[] = [];
  proposicionLey = 0;
  proposicionLeyOrganica = 0;
  proposicionNoLey = 0;
  proyectoLey = 0;
  decretoLey = 0;
  richSnippets = true;

  constructor(
      private lawService: LawService,
      private metaTagService: Meta,
      private titleService: Title,
      @Inject(DOCUMENT) private document: Document) {

        if (this.richSnippets) {
          this.richSnippets = false;
          this.setRichSnippetBreadcrumb()
        }
  }

  ngOnInit() {
    this.getPartyLaws();
    this.getPartyResults();
    const title = 'Estadísticas de votaciones en el Congreso de los Diputados';
    this.titleService.setTitle(title);
    this.metaTagService.updateTag({ name: 'description', content: title });
    window.scroll(-1, 0);
  }

  setRichSnippetBreadcrumb() {
    let script = this.document.createElement('script');
    script.id = 'breadcrumb';
    script.type = 'application/ld+json';
    script.text = '{' +
      '"@context": "https://schema.org", ' +
      '"@type": "BreadcrumbList", ' +
      '"itemListElement": [{' +
        '"@type": "ListItem", ' +
        '"position": 1, ' +
        '"name": "Estadísticas", ' +
        '"item": "https://referenda.es/estadisticas"' +
      '}]' +
      '}';
    const prev = this.document.getElementById('breadcrumb')
    if (prev) {
      prev.remove()
    }
    this.document.getElementsByTagName('head')[0].appendChild(script);
  }

  getPartyLaws(): void {
    this.lawService.getAllLaws()
      .subscribe(laws => {
        this.laws = laws;
        this.totalLaws = laws.length;
        this.institutionProposals = this.buildData(this.laws);
        this.maxPartyLaws = this.getMaxPartyLaws(this.institutionProposals);
        this.ccaaProposals = this.buildCCAAData(this.laws);
        this.lawsTypes(laws);
        this.progressCard(laws, 'law', this.buildData, 80);
        this.progressCard(laws, 'law', this.buildCCAAData, 70);
        this.getAreaLaws();
      });
  }

  getMaxPartyLaws(parties: any[]): number {
    let maxValue = 0;
    parties.forEach( d => {
      if (d.value > maxValue) {
        maxValue = d.value;
      }
    });
    return maxValue;
  }

  lawsTypes(laws: Law[]): void {
    this.proposicionLey = laws.filter(l => l.law_type === 'Proposición de Ley').length;
    this.proposicionLeyOrganica = laws.filter(l => l.law_type === 'Proposición de Ley Orgánica').length;
    this.proposicionNoLey = laws.filter(l => l.law_type === 'Proposición no de Ley').length;
    this.proyectoLey = laws.filter(l => l.law_type === 'Proyecto de Ley').length;
    this.decretoLey = laws.filter(l => l.law_type === 'Real Decreto-Ley').length;
  }

  getPartyResults(): void {
    this.lawService.getResults()
      .subscribe(laws => {
        this.institutionVoted = this.buildData(laws);
        this.maxPartyResults = this.getMaxPartyLaws(this.institutionVoted);
        this.ccaaVoted = this.buildCCAAData(laws);
        // this.progressCard(laws, 'result', this.buildData, 80);
        // this.progressCard(laws, 'result', this.buildCCAAData, 70);
      });
  }

  getAreaLaws(): void {
    let data = [];
    const parties = ['psoe', 'pp', 'vox', 'sumar', 'erc', 'jpc', 'pnv', 'bildu', 'cc', 'upn',
                     'bng', 'gobierno', 'senado', 'popular'];
    for (const p in parties) {
      if (parties.hasOwnProperty(p)) {
        data = data.concat(this.buildPartyAreaData(parties[p], this.laws.filter(l => l.institution.includes(parties[p]))));
      }
    }
    this.drawArea('partyArea', this.totalLaws, data);
  }

  buildData(laws: Law[]) {
    const psoe = {'label': 'PSOE', 'id': 1, 'value': 0, 'width': 0, 'color': '#ee1d1d'};
    const pp = {'label': 'PP', 'id': 2, 'value': 0, 'width': 0, 'color': '#00a3df'};
    const vox = {'label': 'VOX', 'id': 3, 'value': 0, 'width': 0, 'color': '#81c03b'};
    const sumar = {'label': 'SUMAR', 'id': 4, 'value': 0, 'width': 0, 'color': '#683064'};
    const erc = {'label': 'ERC', 'id': 5, 'value': 0, 'width': 0, 'color': '#feb832'};
    const jpc = {'label': 'Junts per Cat', 'id': 7, 'value': 0, 'width': 0, 'color': '#02428b'};
    const pnv = {'label': 'PNV', 'id': 8, 'value': 0, 'width': 0, 'color': '#409552'};
    const bildu = {'label': 'Bildu', 'id': 9, 'value': 0, 'width': 0, 'color': '#b0d136'};
    const cc = {'label': 'Coal. Canaria', 'id': 12, 'value': 0, 'width': 0, 'color': '#ffed00'};
    const upn = {'label': 'Unión del Pueblo Navarro', 'id': 13, 'value': 0, 'width': 0, 'color': '#0065a7'};
    const bng = {'label': 'BNG', 'id': 14, 'value': 0, 'width': 0, 'color': '#76b3dd'};
    const gobierno = {'label': 'Gobierno', 'id': 17, 'value': 0, 'width': 0, 'color': '#000'};
    const senado = {'label': 'Senado', 'id': 18, 'value': 0, 'width': 0, 'color': '#038758'};
    const popular = {'label': 'Iniciativa Pop.', 'id': 19, 'value': 0, 'width': 0, 'color': '#ffb400'};
    laws.forEach( (law) => {
      if (law.institution.includes('psoe')) { psoe.value += 1; }
      if (law.institution.includes('pp')) { pp.value += 1; }
      if (law.institution.includes('vox')) { vox.value += 1; }
      if (law.institution.includes('sumar')) { sumar.value += 1; }
      if (law.institution.includes('erc')) { erc.value += 1; }
      if (law.institution.includes('jpc')) { jpc.value += 1; }
      if (law.institution.includes('pnv')) { pnv.value += 1; }
      if (law.institution.includes('bildu')) { bildu.value += 1; }
      if (law.institution.includes('cc')) { cc.value += 1; }
      if (law.institution.includes('upn')) { upn.value += 1; }
      if (law.institution.includes('bng')) { bng.value += 1; }
      if (law.institution.includes('gobierno')) { gobierno.value += 1; }
      if (law.institution.includes('senado')) { senado.value += 1; }
      if (law.institution.includes('popular')) { popular.value += 1; }
    });
    return [psoe, pp, vox, sumar, erc, jpc, pnv, bildu, cc, upn, bng, gobierno, senado, popular];
  }

  buildCCAAData(laws: Law[]) {
    const andalucia = {'label': 'Andalucía', 'id': 1, 'value': 0, 'color': '#006433'};
    const aragon = {'label': 'Aragón', 'id': 2, 'value': 0, 'color': '#d51418'};
    const asturias = {'label': 'Principado de Asturias', 'id': 3, 'value': 0, 'color': '#e15eed'};
    const baleares = {'label': 'Illes Balears', 'id': 4, 'value': 0, 'color': '#40104c'};
    const canarias = {'label': 'Canarias', 'id': 6, 'value': 0, 'color': '#ffcd00'};
    const cantabria = {'label': 'Cantabria', 'id': 5, 'value': 0, 'color': '#da121a'};
    const castillalamancha = {'label': 'Castilla-La Mancha', 'id': 7, 'value': 0, 'color': '#a11c1b'};
    const castillayleon = {'label': 'Castilla y León', 'id': 8, 'value': 0, 'color': '#722d64'};
    const catalunya = {'label': 'Catalunya', 'id': 9, 'value': 0, 'color': '#db0a13'};
    const extremadura = {'label': 'Extremadura', 'id': 10, 'value': 0, 'color': '#00aa39'};
    const galicia = {'label': 'Galicia', 'id': 11, 'value': 0, 'color': '#0098ca'};
    const rioja = {'label': 'La Rioja', 'id': 12, 'value': 0, 'color': '#67bb2b'};
    const madrid = {'label': 'Comunidad de Madrid', 'id': 13, 'value': 0, 'color': '#bc0a1c'};
    const murcia = {'label': 'Región de Murcia', 'id': 14, 'value': 0, 'color': '#9a1f2e'};
    const navarra = {'label': 'Com. Foral de Navarra', 'id': 15, 'value': 0, 'color': '#d41219'};
    const paisvasco = {'label': 'País Vasco', 'id': 16, 'value': 0, 'color': '#009c46'};
    const valencia = {'label': 'Comunidad Valenciana', 'id': 17, 'value': 0, 'color': '#fbd70f'};
    const ceuta = {'label': 'Ceuta', 'id': 17, 'value': 0, 'color': '#000'};
    const melilla = {'label': 'Melilla', 'id': 17, 'value': 0, 'color': '#4c86c9'};
    laws.forEach( (law) => {
      if (law.institution.includes('andalucia')) { andalucia.value += 1; }
      if (law.institution.includes('aragon')) { aragon.value += 1; }
      if (law.institution.includes('asturias')) { asturias.value += 1; }
      if (law.institution.includes('baleares')) { baleares.value += 1; }
      if (law.institution.includes('canarias')) { canarias.value += 1; }
      if (law.institution.includes('cantabria')) { cantabria.value += 1; }
      if (law.institution.includes('mancha')) { castillalamancha.value += 1; }
      if (law.institution.includes('leon')) { castillayleon.value += 1; }
      if (law.institution.includes('catalunya')) { catalunya.value += 1; }
      if (law.institution.includes('extremadura')) { extremadura.value += 1; }
      if (law.institution.includes('galicia')) { galicia.value += 1; }
      if (law.institution.includes('rioja')) { rioja.value += 1; }
      if (law.institution.includes('madrid')) { madrid.value += 1; }
      if (law.institution.includes('murcia')) { murcia.value += 1; }
      if (law.institution.includes('navarra')) { navarra.value += 1; }
      if (law.institution.includes('vasco')) { paisvasco.value += 1; }
      if (law.institution.includes('valencia')) { valencia.value += 1; }
      if (law.institution.includes('ceuta')) { ceuta.value += 1; }
      if (law.institution.includes('melilla')) { melilla.value += 1; }
    });
    return [andalucia, aragon, asturias, baleares, canarias, cantabria, castillalamancha, castillayleon, catalunya,
            extremadura, galicia, rioja, madrid, murcia, navarra, paisvasco, valencia, ceuta, melilla];
  }

  buildPartyAreaData(party: string, laws: Law[]) {
    const educacion = {'party': party, 'label': 'Educación', 'id': 1, 'value': 0, 'color': '#006433'};
    const sanidad = {'party': party, 'label': 'Sanidad', 'id': 2, 'value': 0, 'color': '#d51418'};
    const economia = {'party': party, 'label': 'Economía', 'id': 2, 'value': 0, 'color': '#d51418'};
    const justicia = {'party': party, 'label': 'Justicia', 'id': 2, 'value': 0, 'color': '#d51418'};
    const exteriores = {'party': party, 'label': 'Exteriores', 'id': 2, 'value': 0, 'color': '#d51418'};
    const defensa = {'party': party, 'label': 'Defensa', 'id': 2, 'value': 0, 'color': '#d51418'};
    const interior = {'party': party, 'label': 'Interior', 'id': 2, 'value': 0, 'color': '#d51418'};
    const agricultura = {'party': party, 'label': 'Agricultura', 'id': 2, 'value': 0, 'color': '#d51418'};
    const infraestructuras = {'party': party, 'label': 'Infraestructuras', 'id': 2, 'value': 0, 'color': '#d51418'};
    const cultura = {'party': party, 'label': 'Cultura', 'id': 2, 'value': 0, 'color': '#d51418'};
    laws.forEach( (law) => {
      if (law.area.includes('educacion')) { educacion.value += 1 / law.area.length / law.institution.length; }
      if (law.area.includes('sanidad')) { sanidad.value += 1 / law.area.length / law.institution.length; }
      if (law.area.includes('economia')) { economia.value += 1 / law.area.length / law.institution.length; }
      if (law.area.includes('justicia')) { justicia.value += 1 / law.area.length / law.institution.length; }
      if (law.area.includes('exteriores')) { exteriores.value += 1 / law.area.length / law.institution.length; }
      if (law.area.includes('defensa')) { defensa.value += 1 / law.area.length / law.institution.length; }
      if (law.area.includes('interior')) { interior.value += 1 / law.area.length / law.institution.length; }
      if (law.area.includes('agricultura')) { agricultura.value += 1 / law.area.length / law.institution.length; }
      if (law.area.includes('infraestructuras')) { infraestructuras.value += 1 / law.area.length / law.institution.length; }
      if (law.area.includes('cultura')) { cultura.value += 1 / law.area.length / law.institution.length; }
    });
    return [educacion, sanidad, economia, justicia, exteriores, defensa, interior, agricultura, infraestructuras,
            cultura];
  }

  partyBars() {
    // Obtención del número de leyes presentadas por el partido que más leyes ha presentado. Representa una barra al 100%
    // Para cada partido obtener su % relativo de leyes presentadas


  }

  progressCard(laws: Law[], idPrefix: string, dataBuilder, progressWidth) {
    const data = dataBuilder(laws);
    let maxValue = 0;
      data.forEach( d => {
        if (d.value > maxValue) {
          maxValue = d.value;
        }
      });
    data.forEach( (d) => {
      document.getElementById(idPrefix + d.label).style.width =  d.value * progressWidth / maxValue + '%';
      document.getElementById(idPrefix + d.label).setAttribute('aria-valuenow', d.value * progressWidth / maxValue + '%');
      if (d.value !== 0) {
        document.getElementById(idPrefix + d.label).innerHTML = d.value.toString() + '&nbsp';
        document.getElementById(idPrefix + d.label).classList.add('bg-secondary');
      }
    });
  }

  draw(results: any[]) {
    const WIDTH = 700;
    const HEIGHT = 432;

    const d3Svg = d3.select('svg');
    d3Svg.selectAll('g').remove();
    d3Svg.append<SVGGElement>('g');

    d3Svg
      .style('width', WIDTH)
      .style('height', HEIGHT);

    const labels = results.map(datum => datum.label);
    const xScale = d3.scaleBand()
      .range([0, WIDTH])
      .domain(labels);
    const yMax = d3.max(results, function(datum) { return datum.value; });
    const yScale = d3.scaleLinear().domain([0, yMax + 1]).range([HEIGHT, 0]);
    const barWidth = WIDTH / results.length - (WIDTH * 0.1 / results.length);

    d3Svg.selectAll<SVGRectElement, any>('rect')
      .data(results)
      .attr('height', function(datum) {
        return HEIGHT - yScale(datum.value);
      })
      .attr('y', function(datum) {
        return yScale(datum.value);
      })
      .attr('x', function(datum) {
        return xScale(datum.label);
      })
      .attr('width', barWidth)
      .attr('fill', function(datum) {
        return datum.color;
      });

    const bottomAxis = d3.axisBottom(xScale).tickSizeInner(0).tickSizeOuter(0);
    d3Svg.append<SVGGElement>('g')
      .attr('transform', 'translate(0,' + HEIGHT + ')')
      .call(bottomAxis);

    d3Svg.selectAll<SVGTextElement, any>('text')
      .attr('transform', 'rotate(-45)')
      .attr('text-anchor', 'end');

    const leftAxis = d3.axisLeft(yScale).tickSize(-WIDTH).ticks(yMax + 1).tickFormat(d3.format('.0f'));
    d3Svg.append<SVGGElement>('g')
      .attr('class', 'gridLine')
      .call(leftAxis);

    d3Svg.selectAll('.gridLine line')
      .style('stroke', '#ddd');
  }

  drawArea(id: string, totalLaws: number, laws: any[]) {
    const WIDTH = document.getElementById(id).offsetWidth * 0.95;
    const HEIGHT = WIDTH * 0.6;

    const margin = {top: 0, right: 0, bottom: 30, left: 40},
          width = WIDTH - margin.left - margin.right,
          height = HEIGHT - margin.top - margin.bottom;

    const d3Svg = d3.select('svg');
    d3Svg.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');
    d3Svg.selectAll('g').remove();
    d3Svg.append<SVGGElement>('g');

    // Labels of row and columns
    const myParties = laws.map(law => law.party);
    const myLabels = ['Educación', 'Sanidad', 'Economía', 'Justicia', 'Exteriores', 'Defensa', 'Interior',
                      'Agricultura', 'Infraestructuras', 'Cultura'];

    d3Svg
      .style('width', width + margin.left + margin.right)
      .style('height', height + margin.top + margin.bottom);

    // Build X scales and axis:
    const x = d3.scaleBand()
      .range([ 0, width ])
      .domain(myParties)
      .padding(0.01);
    d3Svg.append('g')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x));
    d3Svg.selectAll<SVGTextElement, any>('text')
      .attr('transform', 'rotate(-45)')
      .attr('text-anchor', 'end');

    // Build X scales and axis:
    const y = d3.scaleBand()
      .range([ height, 0 ])
      .domain(myLabels)
      .padding(0.01);
    d3Svg.append('g')
      .call(d3.axisLeft(y));

    // Build color scale
    let maxValue = 0;
    laws.forEach( l => {
      if (l.value > maxValue) {
        console.log(l.value);
        maxValue = l.value;
      }
    });
    const myColor = d3.scaleLinear<string>()
      .range(['white', 'grey'])
      .domain([0, maxValue]);

    const myNumber = function(n: number) {
      if (n === 0) {return ''; }
      return (n * 100 / totalLaws).toFixed(1) + '%';
    };

    // Read the data
    d3Svg.selectAll()
        .data(laws, function(d) {return d.party + ':' + d.label; })
        .enter()
        .append('rect')
        .attr('x', function(d) {
          return x(d.party);
        })
        .attr('y', function(d) {return y(d.label); })
        .attr('width', x.bandwidth() )
        .attr('height', y.bandwidth() )
        .style('fill', function(d) {
          console.log(myColor(d.value));
          return myColor(d.value);
        } );
    d3Svg.selectAll()
        .data(laws, function(d) {return d.party + ':' + d.label; })
        .enter()
        .append('text')
        .attr('x', function(d) {return x(d.party) + 27; })
        .attr('y', function(d) {return y(d.label) + 33; })
        .attr('width', x.bandwidth() )
        .attr('height', y.bandwidth() )
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .text(function(d) { return myNumber(d.value); });
  }
}
