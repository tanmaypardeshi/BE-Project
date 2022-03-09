from django.contrib import admin
from .models import Question


class QuestionAdmin(admin.ModelAdmin):
    list_display = ('user', 'question_text', 'answer_text', 'asked_on')
    fieldsets = (
        ('Login Info', {'fields': ('user', )}),
        ('Question and Answer', {'fields': ('question_text', 'answer_text')}),
        ('Time', {'fields': ('asked_on', )}),
    )
    readonly_fields = ['asked_on']


admin.site.register(Question, QuestionAdmin)
