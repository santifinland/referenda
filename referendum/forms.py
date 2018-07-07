from django import forms
from django.forms import widgets
from django.utils.translation import ugettext_lazy
from models import Comment, DelegatedVote


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


class DelegateVoteForm(forms.Form):
    partie = forms.CharField()

    def is_valid(self):
        form = super(DelegateVoteForm, self).is_valid()
        for f in self.errors.iterkeys():
            if f != '__all__':
                self.fields[f].widget.attrs.update({'class': 'error'})
        return form

    class Meta:
        fields = ['partie']
        exclude = ('user',)


class RegionForm(forms.Form):
    region = forms.CharField()

    def is_valid(self):
        form = super(RegionForm, self).is_valid()
        for f in self.errors.iterkeys():
            if f != '__all__':
                self.fields[f].widget.attrs.update({'class': 'error'})
        return form

    class Meta:
        fields = ['region']
        exclude = ('user',)


class CityForm(forms.Form):
    city = forms.CharField()
    region = forms.CharField()

    def is_valid(self):
        form = super(CityForm, self).is_valid()
        for f in self.errors.iterkeys():
            if f != '__all__':
                self.fields[f].widget.attrs.update({'class': 'error'})
        return form

    class Meta:
        fields = ['city',]
        exclude = ('user', 'region')


class TierForm(forms.Form):
    tier = forms.IntegerField()

    def is_valid(self):
        form = super(TierForm, self).is_valid()
        for f in self.errors.iterkeys():
            if f != '__all__':
                self.fields[f].widget.attrs.update({'class': 'error'})
        return form

    class Meta:
        fields = ['tier',]
