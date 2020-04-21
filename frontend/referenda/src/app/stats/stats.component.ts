import { Component, ElementRef, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

import { D3Service, D3, Selection} from 'd3-ng2-service';

import { Law } from '../_models/law';
import { LawService } from '../law.service';


@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  private d3: D3;
  private d3Svg: Selection<SVGSVGElement, any, null, undefined>;
  private parentNativeElement: any;

  ccaaLawsShown: Boolean = false;
  ccaaResultsShown: Boolean = false;
  partyLawsShown: boolean = true;
  partyResultsShown: boolean = false;

  constructor(
      element: ElementRef,
      d3Service: D3Service,
      private lawService: LawService,
      private metaTagService: Meta,
      private titleService: Title) {
    this.d3 = d3Service.getD3();
    this.parentNativeElement = element.nativeElement;
  }

  getPartyLaws(): void {
    this.lawService.getAllLaws()
      .subscribe(laws => {
        const data = this.buildData(laws);
        this.draw(data);
        document.getElementById('partyLaws').scrollIntoView({behavior: "smooth"});
      });
  }

  getCCAALaws(): void {
    this.lawService.getAllLaws()
      .subscribe(laws => {
        const data = this.buildCCAAData(laws);
        this.draw(data);
        document.getElementById('ccaaLaws').scrollIntoView({behavior: "smooth"});
      });
  }

  getPartyResults(): void {
    this.lawService.getResults()
      .subscribe(laws => {
        const data = this.buildData(laws);
        this.draw(data);
        document.getElementById('partyResults').scrollIntoView({behavior: "smooth"});
      });
  }

  getCCAAResults(): void {
    this.lawService.getResults()
      .subscribe(laws => {
        const data = this.buildCCAAData(laws);
        this.draw(data);
        document.getElementById('ccaaResults').scrollIntoView({behavior: "smooth"});
      });
  }

  ngOnInit() {
    this.getPartyLaws();
    const title = 'Estadísticas de votaciones en el Congreso de los Diputados';
    this.titleService.setTitle(title);
    this.metaTagService.updateTag({ name: 'description', content: title });
    window.scroll(0,0);
  }

  stat(selectedStat): void {
    if (selectedStat === 'partyLaws') {
      this.getPartyLaws();
      this.ccaaLawsShown = false;
      this.ccaaResultsShown = false;
      this.partyLawsShown = true;
      this.partyResultsShown = false;
    } else if (selectedStat === 'partyResults') {
      this.getPartyResults();
      this.ccaaLawsShown = false;
      this.ccaaResultsShown = false;
      this.partyLawsShown = false;
      this.partyResultsShown = true;
    } else if (selectedStat === 'ccaaLaws') {
      this.getCCAALaws();
      this.ccaaLawsShown = true;
      this.ccaaResultsShown = false;
      this.partyLawsShown = false;
      this.partyResultsShown = false;
    } else if (selectedStat === 'ccaaResults') {
      this.getCCAAResults();
      this.ccaaLawsShown = false;
      this.ccaaResultsShown = true;
      this.partyLawsShown = false;
      this.partyResultsShown = false;
    } else {
    }
  }

  buildData(laws: Law[]) {
    const psoe = {'label': 'PSOE', 'id': 1, 'value': 0, 'color': '#ee1d1d'};
    const pp = {'label': 'PP', 'id': 2, 'value': 0, 'color': '#00a3df'};
    const vox = {'label': 'VOX', 'id': 3, 'value': 0, 'color': '#81c03b'};
    const podemos = {'label': 'Podemos-IU', 'id': 4, 'value': 0, 'color': '#683064'};
    const ciudadanos = {'label': 'Ciudadanos', 'id': 6, 'value': 0, 'color': '#f36b25'};
    const erc = {'label': 'ERC', 'id': 5, 'value': 0, 'color': '#feb832'};
    const jpc = {'label': 'Junts per Catalunya', 'id': 7, 'value': 0, 'color': '#02428b'};
    const pnv = {'label': 'PNV', 'id': 8, 'value': 0, 'color': '#409552'};
    const bildu = {'label': 'Bildu', 'id': 9, 'value': 0, 'color': '#b0d136'};
    const mp = {'label': 'Más País', 'id': 10, 'value': 0, 'color': '#0ff'};
    const cup = {'label': 'CUP', 'id': 11, 'value': 0, 'color': '#ffeea7'};
    const cc = {'label': 'Coalición Canaria', 'id': 12, 'value': 0, 'color': '#ffed00'};
    const upn = {'label': 'Navarra Suma', 'id': 13, 'value': 0, 'color': '#0065a7'};
    const bng = {'label': 'Bloque Nacionalista Galego', 'id': 14, 'value': 0, 'color': '#76b3dd'};
    const prc = {'label': 'Partido Regionalista de Cantabria', 'id': 15, 'value': 0, 'color': '#bfcd16'};
    const te = {'label': 'Teruel Existe', 'id': 16, 'value': 0, 'color': '#007f54'};
    const gobierno = {'label': 'Gobierno', 'id': 17, 'value': 0, 'color': '#000'};
    const senado = {'label': 'Senado', 'id': 18, 'value': 0, 'color': '#038758'};
    const popular = {'label': 'Iniciativa Legislativa Popular', 'id': 19, 'value': 0, 'color': '#ffb400'};
    laws.forEach( (law) => {
      if (law.institution.includes('psoe')) { psoe.value += 1; }
      if (law.institution.includes('pp')) { pp.value += 1; }
      if (law.institution.includes('vox')) { vox.value += 1; }
      if (law.institution.includes('podemos')) { podemos.value += 1; }
      if (law.institution.includes('erc')) { erc.value += 1; }
      if (law.institution.includes('ciudadanos')) { ciudadanos.value += 1; }
      if (law.institution.includes('jpc')) { jpc.value += 1; }
      if (law.institution.includes('pnv')) { pnv.value += 1; }
      if (law.institution.includes('bildu')) { bildu.value += 1; }
      if (law.institution.includes('mp')) { mp.value += 1; }
      if (law.institution.includes('cup')) { cup.value += 1; }
      if (law.institution.includes('cc')) { cc.value += 1; }
      if (law.institution.includes('upn')) { upn.value += 1; }
      if (law.institution.includes('bng')) { bng.value += 1; }
      if (law.institution.includes('prc')) { prc.value += 1; }
      if (law.institution.includes('te')) { te.value += 1; }
      if (law.institution.includes('gobierno')) { gobierno.value += 1; }
      if (law.institution.includes('senado')) { senado.value += 1; }
      if (law.institution.includes('popular')) { popular.value += 1; }
    });
    return [psoe, pp, vox, podemos, erc, ciudadanos, jpc, pnv, bildu, mp, cup, cc, upn, bng, prc, te, gobierno, senado,
            popular];
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
    const navarra = {'label': 'Comunidad Foral de Navarra', 'id': 15, 'value': 0, 'color': '#d41219'};
    const paisvasco = {'label': 'País Vasco', 'id': 16, 'value': 0, 'color': '#009c46'};
    const valencia = {'label': 'Comunidad Valenciana', 'id': 17, 'value': 0, 'color': '#fbd70f'};
    const ceuta = {'label': 'Ceuta', 'id': 17, 'value': 0, 'color': '#000'};
    const melilla = {'label': 'Melilla', 'id': 17, 'value': 0, 'color': '#4c86c9'};
    laws.forEach( (law) => {
      if (law.institution.includes('Comunidad Autónoma de Andalucía')) { andalucia.value += 1; }
      if (law.institution.includes('Comunidad Autónoma de Aragón')) { aragon.value += 1; }
      if (law.institution.includes('Comunidad Autónoma del Principado de Asturias')) { asturias.value += 1; }
      if (law.institution.includes('Comunidad Autónoma de las Illes Balears')) { baleares.value += 1; }
      if (law.institution.includes('Comunidad Autónoma de Canarias')) { canarias.value += 1; }
      if (law.institution.includes('Comunidad Autónoma de Cantabria')) { cantabria.value += 1; }
      if (law.institution.includes('Comunidad Autónoma de Castilla-La Mancha')) { castillalamancha.value += 1; }
      if (law.institution.includes('Comunidad Autónoma de Castilla y León')) { castillayleon.value += 1; }
      if (law.institution.includes('Comunidad Autónoma de Cataluña')) { catalunya.value += 1; }
      if (law.institution.includes('Comunidad Autónoma de Extremadura')) { extremadura.value += 1; }
      if (law.institution.includes('Comunidad Autónoma de Galicia')) { galicia.value += 1; }
      if (law.institution.includes('Comunidad Autónoma de La Rioja')) { rioja.value += 1; }
      if (law.institution.includes('Comunidad Autónoma de Madrid')) { madrid.value += 1; }
      if (law.institution.includes('Comunidad Autónoma de la Región de Murcia')) { murcia.value += 1; }
      if (law.institution.includes('Comunidad Autónoma de Navarra')) { navarra.value += 1; }
      if (law.institution.includes('Comunidad Autónoma del País Vasco')) { paisvasco.value += 1; }
      if (law.institution.includes('Comunidad Autónoma de Valencia')) { valencia.value += 1; }
      if (law.institution.includes('Ciudad Autónoma de Ceuta')) { ceuta.value += 1; }
      if (law.institution.includes('Ciudad Autónoma de Melilla')) { melilla.value += 1; }
    });
    return [andalucia, aragon, asturias, baleares, canarias, cantabria, castillalamancha, castillayleon, catalunya,
            extremadura, galicia, rioja, madrid, murcia, navarra, paisvasco, valencia, ceuta, melilla];
  }

  draw(results: any[]) {
    const d3 = this.d3;
    let d3ParentElement: Selection<HTMLElement, any, null, undefined>;
    let d3Svg: Selection<SVGSVGElement, any, null, undefined>;
    let d3G: Selection<SVGGElement, any, null, undefined>;
    const WIDTH = 700;
    const HEIGHT = 432;

    if (this.parentNativeElement !== null) {
      d3ParentElement = d3.select(this.parentNativeElement);
      d3Svg = this.d3Svg = d3ParentElement.select<SVGSVGElement>('svg');
      d3Svg.selectAll('g').remove();
      d3G = d3Svg.append<SVGGElement>('g');

      d3Svg
        .style('width', WIDTH)
        .style('height', HEIGHT);

      const labels = results.map(datum => datum.label);
      const xScale = d3.scaleBand()
        .range([0, WIDTH])
        .domain(labels);
      const yMax = d3.max(results, function(datum, index) { return datum.value; });
      const yScale = d3.scaleLinear().domain([0, yMax + 1]).range([HEIGHT, 0]);
      const barWidth = WIDTH / results.length - (WIDTH * 0.1 / results.length);

      d3Svg.selectAll<SVGRectElement, any>('rect')
        .data(results)
        .attr('height', function(datum, index) {
          return HEIGHT - yScale(datum.value);
        })
        .attr('y', function(datum, index) {
          return yScale(datum.value);
        })
        .attr('x', function(datum, index) {
          return xScale(datum.label);
        })
        .attr('width', barWidth)
        .attr('fill', function(datum, index) {
          return datum.color;
        });

      const bottomAxis = d3.axisBottom(xScale).tickSizeInner(0).tickSizeOuter(0);
      const baseLine = HEIGHT;
      d3Svg.append<SVGGElement>('g')
        .attr('transform', 'translate(0,' + baseLine + ')')
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
  }
}
