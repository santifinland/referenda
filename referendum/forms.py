from django import forms
from django.utils.translation import ugettext_lazy
from models import Comment

class VoteForm(forms.Form):
    vote = forms.BooleanField(initial=True)

class CommentForm(forms.ModelForm):
    comment = forms.CharField(required=True, widget=forms.widgets.Textarea(attrs={'placeholder':
        ugettext_lazy("Your comment")}), label='Comment')

    def is_valid(self):
        form = super(CommentForm, self).is_valid()
        for f in self.errors.iterkeys():
            if f != '__all__':
                self.fields[f].widget.attrs.update({'class': 'error'})
        return form
 
    class Meta:
        fields = ['comment']
        model = Comment
        exclude = ('user',)


class DeleteAccountForm(forms.Form):
    reason = forms.CharField(required=False, widget=forms.widgets.Textarea(attrs={'placeholder':
        ugettext_lazy('Please, could you tell us why you leave Referenda.es?')}), label='Razon')

    def is_valid(self):
        form = super(DeleteAccountForm, self).is_valid()
        for f in self.errors.iterkeys():
            if f != '__all__':
                self.fields[f].widget.attrs.update({'class': 'error'})
        return form

    class Meta:
        fields = ['reason']
        exclude = ('user',)
