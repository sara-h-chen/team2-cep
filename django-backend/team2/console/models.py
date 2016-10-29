from __future__ import unicode_literals

from django.db import models
from django.utils.encoding import python_2_unicode_compatible

@python_2_unicode_compatible # to support Python 2
class Name(models.Model):
    first_name = models.CharField('First Name', max_length=200)
    last_name = models.CharField('Last Name', max_length=200)
    
    #prints out details of object
    def __str__(self):
        return self.first_name + " " + self.last_name

# Create your models here.
