import abc


class Page(metaclass=abc.ABCMeta):
    @abc.abstractmethod
    def render(self):
        pass

    @abc.abstractmethod
    def finish(self):
        pass

    @abc.abstractmethod
    def set_data(self, data):
        pass

    @abc.abstractmethod
    def set_callback(self, callback):
        pass

    @abc.abstractmethod
    def _show_title(self):
        pass
