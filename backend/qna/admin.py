from django.contrib import admin
from .models import Question, Answer


class QuestionAdmin(admin.ModelAdmin):
    list_display = ('author', 'question_text', 'asked_on')
    fieldsets = (
        ('Login Info', {'fields': ('user', )}),
        ('Question', {'fields': ('question_text', )}),
        ('Time', {'fields': ('asked_on', )}),
    )
    readonly_fields = ['user', 'question_text', 'asked_on']


class AnswerAdmin(admin.ModelAdmin):
    list_display = ('author', 'question', 'answer_text')
    readonly_fields = ['question', 'answer_text']


admin.site.register(Question, QuestionAdmin)
admin.site.register(Answer, AnswerAdmin)
