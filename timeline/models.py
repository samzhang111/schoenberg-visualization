from django.db import models

class Transaction(models.Model):
    duplicate_ms = models.TextField(null=True, blank=True)
    seller = models.TextField(null=True, blank=True)
    seller_2 = models.TextField(null=True, blank=True)
    institution = models.TextField(null=True, blank=True)
    catalogue_id = models.TextField(null=True, blank=True)
    cat_lot_num = models.TextField(null=True, blank=True)
    price = models.TextField(null=True, blank=True)
    currency = models.TextField(null=True, blank=True)
    sold = models.TextField(null=True, blank=True)
    source = models.TextField(null=True, blank=True)
    cat_date = models.TextField(null=True, blank=True)
    buyer = models.TextField(null=True, blank=True) 
    columns = models.TextField(null=True, blank=True)

    manuscript_id = models.TextField(null=True, blank=True)
    current_location = models.TextField(null=True, blank=True)
    author = models.TextField(null=True, blank=True)
    author_variant = models.TextField(null=True, blank=True)
    title = models.TextField(null=True, blank=True)
    language = models.TextField(null=True, blank=True)
    material = models.TextField(null=True, blank=True)
    place = models.TextField(null=True, blank=True)
    use = models.TextField(null=True, blank=True)
    date = models.TextField(null=True, blank=True)
    circa = models.TextField(null=True, blank=True)
    artist = models.TextField(null=True, blank=True)
    script = models.TextField(null=True, blank=True)
    folios = models.TextField(null=True, blank=True)
    lines = models.TextField(null=True, blank=True)
    height = models.TextField(null=True, blank=True)
    width = models.TextField(null=True, blank=True)
    binding = models.TextField(null=True, blank=True)
    provenance = models.TextField(null=True, blank=True)
    comments = models.TextField(null=True, blank=True)
    link = models.TextField(null=True, blank=True)
    full_page_mini = models.TextField(null=True, blank=True)
    large_mini = models.TextField(null=True, blank=True)
    small_mini = models.TextField(null=True, blank=True)
    mini = models.TextField(null=True, blank=True)
    historiated_initials = models.TextField(null=True, blank=True)
    decorated_initials = models.TextField(null=True, blank=True)

    possible_duplicates = models.TextField(null=True, blank=True)

