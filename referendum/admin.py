from django.contrib import admin
from models import DelegatedVote, Partie, Poll

class PollAdmin(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        obj.votes_positive = self.count_choice(request, 'YES')
        obj.votes_negative = self.count_choice(request, 'NO')
        obj.votes_abstention = self.count_choice(request, 'ABS')
        obj.save()

    def count_choice(self, request, choice):
        count = 0
        parties = Partie.objects.all()
        choice_parties = [partie for partie in parties if request.POST.get(partie.name) == choice]
        delegated_votes = DelegatedVote.objects.all()
        for delegated_vote in delegated_votes:
            if delegated_vote.partie in choice_parties:
                count += 1
        return count

admin.site.register(Poll, PollAdmin)
admin.site.register(Partie)
