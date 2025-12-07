from rest_framework import serializers
from .models import Usuario

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nombre', 'apellido', 'email', 'tipo', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = Usuario(
            email=validated_data['email'],
            nombre=validated_data['nombre'],
            apellido=validated_data['apellido'],
            tipo=validated_data['tipo'],
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
