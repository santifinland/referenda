# -*- coding: utf-8 -*-
from autoslug.fields import AutoSlugField
from django.db import models
from django.contrib.auth.models import User


VOTE_CHOICES = (('YES', 'Yes'), ('NO','No'), ('ABS', 'Abs'),)

   #Comisión Consultiva de Nombramientos Comisión permanente Comisiones de Investigación Comisiones no permanentes Comparecencia de autoridades y funcionarios en Comisión Comparecencia del Gobierno ante el Pleno Comparecencia del Gobierno en Comisión Comparecencias de otras personalidades en Comisión Competencias en relación con la Corona Comunicación del Gobierno Conflicto de competencia ante el Tribunal Constitucional Control de la aplicación del principio de subsidiariedad Convenios entre Comunidades Autónomas Cuenta General del Estado Cuentas anuales de la Corporación RTVE Cuestión de confianza Cuestión de inconstitucionalidad Declaración de actividades Declaración de bienes y rentas Declaración Institucional Designación del Defensor del Pueblo y Adjuntos Documentación remitida a Comisiones para su conocimiento Elección de Consejeros del Tribunal de Cuentas Elección de Magistrados del Tribunal Constitucional Elección de miembros de otros órganos Elección de vocales del C Gral del Poder Judicial Funciones de la Diputación Permanente Funciones de la Mesa de la Cámara Funciones de las Comisiones Funciones del Pleno Información sobre Convenios Internacionales Información sobre secretos oficiales Informe anual del Consejo de Seguridad Nuclear Informe anual del Defensor del Pueblo Informe del Tribunal de Cuentas Iniciativa legislativa popular Interpelación ordinaria Interpelación urgente Investidura del Presidente del Gobierno Memoria anual de la Corporación RTVE Memoria de la Fiscalía General del Estado Memoria del Consejo General del Poder Judicial Moción consecuencia de interpelación ordinaria Moción consecuencia de interpelación urgente Moción de censura Moción de reprobación a miembros del Gobierno Objetivo de estabilidad presupuestaria Operaciones de las Fuerzas Armadas en el exterior Otras solicitudes de informe (formuladas por Diputados) Otras solicitudes de informe (formuladas por las Comisiones) Otros actos en relación con las Comunidades Autónomas Otros asuntos relativos a Convenios Internacionales Otros asuntos relativos al Reglamento del Congreso Otros asuntos relativos al Tribunal de Cuentas Otros informes del Consejo de Seguridad Nuclear Otros informes del Defensor del Pueblo Planes y programas Pregunta a la Corporación RTVE con respuesta escrita Pregunta al Gobierno con respuesta escrita Pregunta oral a la Corporación RTVE Pregunta oral al Gobierno en Comisión Pregunta oral en Pleno Proposición de ley de Comunidades y Ciudades Autónomas Proposición de ley de Diputados Proposición de ley de Grupos Parlamentarios del Congreso Proposición de ley del Senado Proposición de reforma constitucional de Comunidades Autónomas Proposición de reforma constitucional de Grupos Parlamentarios Proposición de reforma del Reglamento del Congreso Proposición no de Ley ante el Pleno Proposición no de Ley en Comisión Propuesta de reforma de Estatuto de Autonomía Propuesta de resolución relativa al art 11 de la Ley Orgánica 6/2002 de Partidos Políticos Proyecto de ley Real Decreto legislativo en desarrollo de Ley de Bases Real Decreto legislativo que aprueba texto refundido Real Decreto-Ley Recurso de amparo Recurso de inconstitucionalidad Recurso previo contra Convenios Internacionales Resolución de la Presidencia del Congreso Resoluciones normativas de las Cortes Generales Solicitud de creación de Comisión de Investigación Solicitud de creación de comisión permanente Solicitud de creación de Comisiones no permanentes Solicitud de creación de Subcomisiones y Ponencias Solicitud de fiscalización del Tribunal de Cuentas Solicitud de informe a la Administración del Estado (formuladas por Diputados) Solicitud de informe a la Administración del Estado (formuladas por las Comisiones) Subcomisiones y Ponencias Suplicatorio
LAW_TYPE_CHOICES = (
    ('alarma_y_sition', u'Actos en relación con los estados de alarma excepción y sitio'),
    ('convenios_internacionales', u'Autorización de Convenios Internacionales'),
    ('referendum', u'Autorización de referéndum'))


REGION_CHOICES = (
    ('Catalunya', u'Catalunya'),
    ('Comunidad de Madrid', u'Comunidad de Madrid'))


CITY_CHOICES = (
    ('Barcelona', u'Barcelona'),
    ('Madrid', u'Madrid'))


INSTITUTION_CHOICES = (
    ('Congreso', u'Congreso'),
    ('Senado', u'Senado')) + REGION_CHOICES + CITY_CHOICES


class Poll(models.Model):
    slug = AutoSlugField(populate_from='headline', unique=True)
    type = models.CharField(max_length=100, choices=LAW_TYPE_CHOICES, default='')
    institution = models.CharField(max_length=50, choices=INSTITUTION_CHOICES, default='Congreso')
    tier = models.IntegerField(default=1)
    headline = models.CharField(max_length=100)
    short_description = models.TextField()
    long_description = models.TextField()
    link = models.CharField(max_length=500)
    pub_date = models.DateTimeField('date published')
    vote_date_start = models.DateTimeField('date vote start')
    vote_date_end = models.DateTimeField('date vote end')
    votes_positive = models.IntegerField(default=0)
    votes_negative = models.IntegerField(default=0)
    votes_abstention = models.IntegerField(default=0)
    result_positive = models.IntegerField(default=0)
    result_negative = models.IntegerField(default=0)
    result_abstention = models.IntegerField(default=0)
    pp = models.CharField(max_length=3, choices=VOTE_CHOICES, default='Yes')
    psoe = models.CharField(max_length=3, choices=VOTE_CHOICES, default='Yes')
    iu = models.CharField(max_length=3, choices=VOTE_CHOICES, default='Yes')
    ciu = models.CharField(max_length=3, choices=VOTE_CHOICES, default='Yes')
    upd = models.CharField(max_length=3, choices=VOTE_CHOICES, default='Yes')
    amaiur = models.CharField(max_length=3, choices=VOTE_CHOICES, default='Yes')
    pnv = models.CharField(max_length=3, choices=VOTE_CHOICES, default='Yes')
    erc = models.CharField(max_length=3, choices=VOTE_CHOICES, default='Yes')
    bng = models.CharField(max_length=3, choices=VOTE_CHOICES, default='Yes')
    cc = models.CharField(max_length=3, choices=VOTE_CHOICES, default='Yes')
    compromis = models.CharField(max_length=3, choices=VOTE_CHOICES, default='Yes')
    gb = models.CharField(max_length=3, choices=VOTE_CHOICES, default='Yes')
    fa = models.CharField(max_length=3, choices=VOTE_CHOICES, default='Yes')

    def get_absolute_url(self):
        return "/referendum/%s/" % self.slug

    def __unicode__(self):
        return self.headline


class Vote(models.Model):
    referendum = models.ForeignKey('Poll')
    userid = models.IntegerField(default=0)
    vote = models.CharField(max_length=3, choices=VOTE_CHOICES, default='Yes')


class Comment(models.Model):
    referendum = models.ForeignKey('Poll')
    user = models.ForeignKey(User)
    comment = models.TextField()


class Partie(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField()
    logo = models.ImageField(upload_to='logos')
    quota = models.IntegerField(default=0)


class DelegatedVote(models.Model):
    user = models.ForeignKey(User)
    partie = models.ForeignKey('Partie')


class Region(models.Model):
    name = models.CharField(max_length=50, choices=REGION_CHOICES, default='Comunidad de Madrid')
    logo = models.ImageField(upload_to='logos')


class City(models.Model):
    name = models.CharField(max_length=50, choices=CITY_CHOICES, default='Madrid')
    logo = models.ImageField(upload_to='logos')
    region = models.ForeignKey('Region')


class Location(models.Model):
    user = models.ForeignKey(User)
    region = models.ForeignKey('Region')
    city = models.ForeignKey('City')


class Tier(models.Model):
    user = models.ForeignKey(User)
    tier = models.IntegerField(default=1)
