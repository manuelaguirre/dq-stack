## Define Question Class
## ######
class Question:
    def __init__(self, prompt, answer):
        self.prompt = prompt
        self.answer = answer


question_prompts = [
    "Combien de Tour de France Bernard Hinaut a-t-il gagne ?\n(1) 3\n(2) 5\n(3) 6\n(4) 7",
    "Quel est la couleur du cheval blanc d'Henri IV?\n(1) Jaune\n(2) Rouge\n(3) Noir\n(4) Blanc ",
]
questions = [
    Question(question_prompts[0], "2"),
    Question(question_prompts[1], "4"),
]


## Distionnaire mapping : Question ; Reponses ; Good one ; image (if any)
question_dict = {
    "Combien de Tour de France Bernard Hinault a-t-il gagne ?": "3 5 6 7 2 images/hinault.jpg",
    "Quel est la couleur du cheval blanc d'Henri IV ?": "Jaune Rouge Noir Blanc 4 images/henri4.jpg",
}
