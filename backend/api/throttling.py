from rest_framework.throttling import AnonRateThrottle


class RealIPAnonRateThrottle(AnonRateThrottle):
    def get_ident(self, request):
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0].strip()
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip