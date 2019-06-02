import { Component, ElementRef, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Axis, D3Service, D3, Selection, ScaleLinear } from 'd3-ng2-service';

import { Law } from '../law';
import { LawService } from '../law.service';


@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {

  laws: Law[];

  private d3: D3;
  private d3Svg: Selection<SVGSVGElement, any, null, undefined>;
  private parentNativeElement: any;

  xPartido: boolean = true;

  constructor(element: ElementRef, d3Service: D3Service, private lawService: LawService, private titleService: Title) {
    this.d3 = d3Service.getD3();
    this.parentNativeElement = element.nativeElement;
  }

  getLaws(): void {
    this.lawService.getResults()
      .subscribe(laws => {
        const results = this.buildData(laws);
        this.draw(results);
      });
  }

  ngOnInit() {
    this.titleService.setTitle("Referenda. Estadísticas");
    this.getLaws();
  }

  stat(selectedStat): void {
    if (selectedStat == 'xPartido') {
      this.xPartido = true;
    }
  }

  buildData(laws: Law[]) {
    var pp = {"label": "PP", "id": 1, "value": 0, "color": "#00a3df"};
    var psoe = {"label": "PSOE", "id": 2, "value": 0, "color": "#ee1d1d"};
    var ciudadanos = {"label": "Ciudadanos", "id": 4, "value": 0, "color": "#f36b25"};
    var podemos = {"label": "Podemos-IU", "id": 3, "value": 0, "color": "#683064"};
    var vox = {"label": "VOX", "id": 8, "value": 0, "color": "#81c03b"};
    var erc = {"label": "ERC", "id": 5, "value": 0, "color": "#feb832"};
    var pnv = {"label": "PNV", "id": 6, "value": 0, "color": "#409552"};
    var cc = {"label": "Coalición Canaria", "id": 7, "value": 0, "color": "#ffed00"};
    var compromis = {"label": "Compromis", "id": 9, "value": 0, "color": "#d74c27"};
    var prc = {"label": "Partido Regionalista de Cantabria", "id": 10, "value": 0, "color": "#16375e"};
    var upn = {"label": "UPN", "id": 11, "value": 0, "color": "#0065a7"};
    var bildu = {"label": "Bildu", "id": 12, "value": 0, "color": "#b0d136"};
    var jpc = {"label": "Junts per Catalunya", "id": 13, "value": 0, "color": "#02428b"};
    var gobierno = {"label": "Gobierno", "id": 14, "value": 0, "color": "#000"};
    laws.forEach( (law) => {
      if (law.institution == "pp") pp.value += 1;
      if (law.institution == "psoe") psoe.value += 1;
      if (law.institution == "ciudadanos") ciudadanos.value += 1;
      if (law.institution == "podemos") podemos.value += 1;
      if (law.institution == "vox") vox.value += 1;
      if (law.institution == "erc") erc.value += 1;
      if (law.institution == "pnv") pnv.value += 1;
      if (law.institution == "cc") cc.value += 1;
      if (law.institution == "compromis") compromis.value += 1;
      if (law.institution == "prc") prc.value += 1;
      if (law.institution == "upn") upn.value += 1;
      if (law.institution == "bildu") bildu.value += 1;
      if (law.institution == "jpc") jpc.value += 1;
      if (law.institution == "gobierno") gobierno.value += 1;
    });
    return [pp, psoe, podemos, ciudadanos, erc, pnv, cc, vox, compromis, prc, upn, bildu, jpc, gobierno]
  }

  draw(results: any[]) {
    let d3 = this.d3;
    let d3ParentElement: Selection<HTMLElement, any, null, undefined>;
    let d3Svg: Selection<SVGSVGElement, any, null, undefined>;
    let d3G: Selection<SVGGElement, any, null, undefined>;
    let WIDTH = 700;
    let HEIGHT = 432;

    if (this.parentNativeElement !== null) {
      d3ParentElement = d3.select(this.parentNativeElement);
      d3Svg = this.d3Svg = d3ParentElement.select<SVGSVGElement>('svg');
      d3G = d3Svg.append<SVGGElement>('g');

      d3Svg
        .style('width', WIDTH)
        .style('height', HEIGHT);

      var labels = results.map(datum => datum.label);
      var xScale = d3.scaleBand()
        .range([0, WIDTH])
        .domain(labels);
      var yMin = d3.min(results, function(datum, index){ return datum.value; });
      var yMax = d3.max(results, function(datum, index){ return datum.value; });
      var yScale = d3.scaleLinear().domain([0, yMax + 1]).range([HEIGHT, 0]);
      var barWidth = WIDTH/results.length - (WIDTH * 0.1 / results.length);

      d3Svg.selectAll<SVGRectElement, any>('rect')
        .data(results)
        .attr('height', function(datum, index){
          return HEIGHT-yScale(datum.value);
        })
        .attr('y', function(datum, index){
          return yScale(datum.value);
        })
        .attr('x', function(datum, index){
          return xScale(datum.label);
        })
        .attr('width', barWidth)
        .attr('fill', function(datum, index){
          return datum.color;
        });

      var bottomAxis = d3.axisBottom(xScale).tickSizeInner(0).tickSizeOuter(0);
      var baseLine = HEIGHT
      d3Svg.append<SVGGElement>('g')
        .attr('transform', 'translate(0,'+baseLine+')')
        .call(bottomAxis);

      d3Svg.selectAll<SVGTextElement, any>('text')
        .attr('transform', 'rotate(-45)')
        .attr('text-anchor', 'end');

      var leftAxis = d3.axisLeft(yScale).tickSize(-WIDTH).ticks(yMax + 1).tickFormat(d3.format(".0f"));
      d3Svg.append<SVGGElement>('g')
        .attr("class", "gridLine")
        .call(leftAxis);

      d3Svg.selectAll('.gridLine line')
        .style('stroke', '#ddd');
    }
  }
}
