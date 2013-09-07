from django.db import models

class Transaction(models.Model):
    duplicate_ms = models.CharField(null=True, blank=True)
    cat_date = models.DateTimeField(null=True, blank=True)
    seller = models.CharField(max_length=500, null=True, blank=True)
    buyer = models.CharField(max_length=500, null=True, blank=True)
    institution = models.CharField(max_length=500, null=True, blank=True)
    catalogue_id = models.CharField(max_length=1000, null=True, blank=True)
    cat_lot_num = models.IntegerField(null=True, blank=True)
    price = models.DecimalField(..., decimal_places=2,null=True, blank=True)
    sold = models.CharField(max_length=30, null=True, blank=True)
    source = models.TextField(null=True, blank=True)

    current_location = 
    author = models.TextField(null=True, blank=True)
    author_variant = models.TextField(null=True, blank=True)
    title = models.TextField(null=True, blank=True)
    language = models.CharField(null=True, blank=True)
    material = models.CharField(null=True, blank=True)
    place = 
    use = 
    date = 
    circa =  
    artist = 
    script = 
    folios = models.IntegerField(null=True, blank=True)
    columns =
    lines = models.IntegerField(null=True, blank=True)
    height = models.IntegerField(null=True, blank=True)
    width = models.IntegerField(null=True, blank=True)
    binding =
    provenance =
    comments =
    link = 
    full_page_mini =
    large_mini =
    small_mini =
    mini =
    historiated_initials =
    decorated_initials =
