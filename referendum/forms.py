from django import forms
from models import Comment, Reason

class VoteForm(forms.Form):
    vote = forms.BooleanField(initial=True)

class CommentForm(forms.ModelForm):
    comment = forms.CharField(required=True, widget=forms.widgets.Textarea(attrs={'placeholder': 'Tu comentario '}),
        label='Comment')
 
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


class DeleteAccountForm(forms.ModelForm):
    reason = forms.CharField(required=False,
        widget=forms.widgets.Textarea(attrs={'placeholder': 'Por que quieres dejar Referenda.es?'}), label='Razon')

    def is_valid(self):
        form = super(DeleteAccountForm, self).is_valid()
        for f in self.errors.iterkeys():
            if f != '__all__':
                self.fields[f].widget.attrs.update({'class': 'error'})
        return form

    class Meta:
        fields = ['reason']
        model = Reason
        exclude = ('user',)
